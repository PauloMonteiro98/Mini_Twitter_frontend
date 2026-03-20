import TextareaAutosize from "react-textarea-autosize";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PostCreationFormFieldsProps {
  titleRegister: UseFormRegisterReturn;
  contentRegister: Omit<UseFormRegisterReturn, "ref">;
  contentRef: React.Ref<HTMLTextAreaElement>;
}

export function PostCreationFormFields({
  titleRegister,
  contentRegister,
  contentRef,
}: PostCreationFormFieldsProps) {
  return (
    <div className="flex flex-col gap-1 pb-3">
      <input
        type="text"
        placeholder="Título"
        {...titleRegister}
        className="bg-transparent text-lg font-bold px-3 pt-2 text-text-muted placeholder:text-text-muted/60 outline-none rounded"
      />
      <TextareaAutosize
        {...contentRegister}
        ref={contentRef}
        placeholder="E aí, o que está rolando?"
        minRows={2}
        id="content"
        className="w-full resize-none overflow-hidden px-3 pt-2 bg-transparent text-lg text-text-muted placeholder:text-text-muted outline-none"
      />
    </div>
  );
}
