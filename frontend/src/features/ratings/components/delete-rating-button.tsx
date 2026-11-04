import { Icon } from '../../../components/ui/icon';

export function DeleteRatingButton({
  title,
  onDelete,
  pending,
  disabled = false,
}: {
  title: string;
  onDelete: () => void;
  pending: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={disabled || pending}
      aria-label={`Excluir avaliação de ${title}`}
      title="Excluir avaliação"
      className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#655276] text-[#d2c8df] transition hover:border-[#e599b5] hover:bg-[#e599b5]/10 hover:text-[#f2b0c8] disabled:cursor-wait disabled:opacity-50"
    >
      <Icon
        name={pending ? 'spinner' : 'trash'}
        className={`size-4 ${pending ? 'animate-spin' : ''}`}
      />
    </button>
  );
}
