import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="absolute top-3 right-3 z-10">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white shadow"
        aria-label="Start video call"
      >
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}

export default CallButton;
