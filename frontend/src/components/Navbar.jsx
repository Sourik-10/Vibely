import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import ProfileImage from "./ProfileImage";
import { getSocketClient } from "../lib/socket";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();
  const [incoming, setIncoming] = useState(null);

  useEffect(() => {
    const socket = getSocketClient();
    const onIncoming = (payload) => setIncoming(payload);
    socket.on("incoming-call", onIncoming);
    return () => socket.off("incoming-call", onIncoming);
  }, []);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
            {incoming && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-error text-white"
                >
                  Incoming call
                </div>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72">
                  <li className="p-2">
                    <div className="font-semibold">Incoming Call</div>
                    <div className="text-sm opacity-70">
                      {incoming.caller?.name || incoming.caller?.id || "Friend"}{" "}
                      is calling
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to={`/call/${incoming.roomId}`}
                        className="btn btn-success btn-sm text-white"
                        onClick={() => setIncoming(null)}
                      >
                        Join
                      </Link>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setIncoming(null)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* TODO */}
          <ThemeSelector />

          <ProfileImage
            src={authUser?.profilePic}
            alt="User Avatar"
            size="sm"
          />

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
