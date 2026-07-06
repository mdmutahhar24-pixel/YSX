import { Button } from "@/components/ui/button";
import { LogOutIcon, TrashIcon } from "lucide-react";
import { logout } from "../actions/logOut";
import { accountDelete } from "../actions/accountRemoval";

export default function Settings() {
  return (
    <div className="w-full h-full items-center flex flex-col justify-center">
      <form className="mb-5" action={accountDelete}>
        <Button variant="destructive"><TrashIcon />Delete Account</Button>
      </form>
      <form action={logout}>
        <Button variant="destructive"><LogOutIcon />Log Out</Button>
      </form>
    </div>
  );
}