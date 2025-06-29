'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pollTitle: string;
  onConfirm: () => void;
}

export function DeletePollDialog({
  open,
  onOpenChange,
  pollTitle,
  onConfirm,
}: DeletePollDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>投票を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            「{pollTitle}」を削除しようとしています。
            この操作は取り消すことができません。投票に関連するすべてのデータが完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
