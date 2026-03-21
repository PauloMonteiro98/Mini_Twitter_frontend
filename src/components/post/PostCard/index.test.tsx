import { api } from "@/api/index";
import type { Post } from "@/types";
import { getLoggedUserId } from "@/utils/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PostCard from "./index";

vi.mock("@/api/index", () => ({
  api: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/utils/auth", () => ({
  getLoggedUserId: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
  useMutation: vi.fn(({ mutationFn, onSuccess, onError }) => ({
    mutate: vi.fn((variables) => {
      mutationFn(variables)
        .then((data: unknown) => onSuccess?.(data, variables))
        .catch((err: unknown) => onError?.(err, variables));
    }),
    isPending: false,
  })),
}));

const mockPost: Post = {
  id: 1,
  title: "Meu Título de Teste",
  content: "Conteúdo do post de teste.",
  authorId: 1,
  authorName: "João Silva",
  createdAt: "2023-10-27T10:00:00Z",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSswwvA9WWb2e3ZfFOEMZHik4jQ9MgJGCEDbg&s",
  isLikedByCurrentUser: false,
};

describe("Componente PostCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(getLoggedUserId).mockReturnValue(2);
  });

  // --- TESTES DE RENDERIZAÇÃO ---

  it("deve renderizar os dados básicos do post corretamente", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText(/@\s*joaosilva/i)).toBeInTheDocument();
    expect(screen.getByText("Meu Título de Teste")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do post de teste.")).toBeInTheDocument();

    const image = screen.getByAltText("Anexo") as HTMLImageElement;
    expect(image.src).toBe(mockPost.image);
  });

  it("deve formatar a data corretamente no padrão pt-BR", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("27/10/2023")).toBeInTheDocument();
  });

  it("não deve mostrar botões de editar/excluir se o usuário não for o dono", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.queryByTitle("Editar")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Excluir")).not.toBeInTheDocument();
  });

  it("deve mostrar botões de editar/excluir se o usuário for o dono", () => {
    vi.mocked(getLoggedUserId).mockReturnValue(Number(mockPost.authorId));

    render(<PostCard post={mockPost} />);
    expect(screen.getByTitle("Editar")).toBeInTheDocument();
    expect(screen.getByTitle("Excluir")).toBeInTheDocument();
  });

  // --- TESTES DE CURTIDA ---

it('deve implementar curtida otimista: altera ícone instantaneamente e chama API', async () => {
  vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } });

  render(<PostCard post={mockPost} />);

  const heartButton = screen.getByRole('button', { name: 'curtir' });
  const heartIcon = heartButton.querySelector('svg');

  expect(heartIcon).not.toHaveClass('fill-[#EB5757]');

  fireEvent.click(heartButton);

  expect(heartIcon).toHaveClass('fill-[#EB5757]');
  expect(api.post).toHaveBeenCalledWith(`/posts/${mockPost.id}/like`);
});

it('deve reverter o ícone (rollback) se a API de like falhar', async () => {
  vi.mocked(api.post).mockRejectedValueOnce(new Error('Falha na API'));

  render(<PostCard post={mockPost} />);

  const heartButton = screen.getByRole('button', { name: 'curtir' });
  const heartIcon = heartButton.querySelector('svg');

  fireEvent.click(heartButton);
  expect(heartIcon).toHaveClass('fill-[#EB5757]');

  await waitFor(() => {
    expect(heartIcon).not.toHaveClass('fill-[#EB5757]');
  });
});

  // --- TESTES DE EDIÇÃO ---

  it("deve entrar no modo de edição e exibir campos de input ao clicar em editar", async () => {
    vi.mocked(getLoggedUserId).mockReturnValue(Number(mockPost.authorId));

    render(<PostCard post={mockPost} />);

    fireEvent.click(screen.getByTitle("Editar"));

    expect(screen.getByPlaceholderText("Título")).toHaveValue(mockPost.title);
    expect(screen.getByPlaceholderText("Editando...")).toHaveValue(
      mockPost.content,
    );
    expect(screen.getByText("Salvar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("deve permitir cancelar a edição e restaurar valores originais", async () => {
    vi.mocked(getLoggedUserId).mockReturnValue(Number(mockPost.authorId));
    const user = userEvent.setup();

    render(<PostCard post={mockPost} />);
    fireEvent.click(screen.getByTitle("Editar"));

    const contentInput = screen.getByPlaceholderText("Editando...");

    await user.clear(contentInput);
    await user.type(contentInput, "Conteúdo alterado");
    expect(contentInput).toHaveValue("Conteúdo alterado");

    fireEvent.click(screen.getByText("Cancelar"));

    expect(
      screen.queryByPlaceholderText("Editando..."),
    ).not.toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
  });

  it("deve enviar payload de edição correto e sair do modo edição ao salvar", async () => {
    vi.mocked(getLoggedUserId).mockReturnValue(Number(mockPost.authorId));
    vi.mocked(api.put).mockResolvedValueOnce({ data: { success: true } });
    const user = userEvent.setup();

    render(<PostCard post={mockPost} />);
    fireEvent.click(screen.getByTitle("Editar"));

    const titleInput = screen.getByPlaceholderText("Título");
    const contentInput = screen.getByPlaceholderText("Editando...");

    await user.type(titleInput, " - Alterado");
    await user.clear(contentInput);
    await user.type(contentInput, "Novo conteúdo salvo.");

    await user.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/posts/${mockPost.id}`, {
        title: "Meu Título de Teste - Alterado",
        content: "Novo conteúdo salvo.",
        image: mockPost.image,
      });
    });
  });
});
