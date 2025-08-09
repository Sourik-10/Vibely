import { Link } from "react-router-dom";
import { LANGUAGE_TO_FLAG, debugLanguageMapping } from "../constants";

const FriendCard = ({ friend }) => {
  // Debug logging
  console.log("FriendCard rendered with friend data:", {
    id: friend._id,
    name: friend.fullName,
    nativeLanguage: friend.nativeLanguage,
    learningLanguage: friend.learningLanguage,
    profilePic: friend.profilePic,
  });

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) {
    console.log("getLanguageFlag: No language provided");
    return null;
  }

  const langLower = language.toLowerCase().trim();
  console.log("getLanguageFlag called with:", language, "->", langLower);

  // Use debug function to check mapping
  debugLanguageMapping(language);

  const countryCode = LANGUAGE_TO_FLAG[langLower];
  console.log("Country code found:", countryCode);

  if (countryCode) {
    // Try multiple flag CDNs for better reliability
    const flagUrls = [
      `https://flagcdn.com/24x18/${countryCode}.png`,
      `https://flagcdn.com/w40/${countryCode}.png`,
      `https://www.countryflags.io/${countryCode}/flat/24.png`,
      `https://www.countryflags.io/${countryCode}/shiny/24.png`,
    ];

    console.log("Flag URLs to try:", flagUrls);

    return (
      <img
        src={flagUrls[0]}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
        onError={(e) => {
          console.log("Primary flag image failed, trying alternative CDN");
          // Try alternative CDN
          if (e.target.dataset.fallbackIndex === undefined) {
            e.target.dataset.fallbackIndex = 0;
          }

          const nextIndex = parseInt(e.target.dataset.fallbackIndex) + 1;
          if (nextIndex < flagUrls.length) {
            e.target.dataset.fallbackIndex = nextIndex;
            e.target.src = flagUrls[nextIndex];
            console.log("Trying alternative flag URL:", flagUrls[nextIndex]);
          } else {
            console.log("All flag URLs failed, falling back to emoji");
            // All flag URLs failed, fallback to emoji
            e.target.style.display = "none";
            const emoji = getLanguageEmoji(langLower);
            if (emoji) {
              e.target.parentNode.insertBefore(
                document.createTextNode(emoji + " "),
                e.target
              );
            }
          }
        }}
        onLoad={(e) =>
          console.log("Flag image loaded successfully from:", e.target.src)
        }
      />
    );
  }

  // Fallback to emoji if no country code mapping
  const emoji = getLanguageEmoji(langLower);
  console.log("Using emoji fallback:", emoji);

  if (emoji) {
    return <span className="mr-1">{emoji}</span>;
  }

  // If no emoji found, show the language name as fallback
  console.log("No flag or emoji found for language:", langLower);
  return <span className="mr-1 text-xs opacity-70">[{langLower}]</span>;
}

function getLanguageEmoji(language) {
  const emojiMap = {
    english: "🇬🇧",
    spanish: "🇪🇸",
    french: "🇫🇷",
    german: "🇩🇪",
    mandarin: "🇨🇳",
    japanese: "🇯🇵",
    korean: "🇰🇷",
    hindi: "🇮🇳",
    russian: "🇷🇺",
    portuguese: "🇵🇹",
    arabic: "🇸🇦",
    italian: "🇮🇹",
    turkish: "🇹🇷",
    dutch: "🇳🇱",
  };

  return emojiMap[language] || null;
}
