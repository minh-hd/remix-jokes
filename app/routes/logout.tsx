import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const action = ({ request }: ActionArgs) => {
  return logout(request);
}

export const loader = () => {
  return redirect("/");
}