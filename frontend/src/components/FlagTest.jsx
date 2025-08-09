import { getLanguageFlag } from "./FriendCard";

const FlagTest = () => {
  const testLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Hindi",
    "Japanese",
    "Korean",
  ];

  return (
    <div className="p-4 border rounded-lg bg-base-100">
      <h3 className="text-lg font-semibold mb-4">Flag Test Component</h3>
      <div className="space-y-2">
        {testLanguages.map((lang) => (
          <div key={lang} className="flex items-center gap-2">
            <span className="font-medium">{lang}:</span>
            {getLanguageFlag(lang)}
            <span className="text-sm opacity-70">({lang})</span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-base-200 rounded">
        <h4 className="font-medium mb-2">Debug Info:</h4>
        <p className="text-sm">Check browser console for flag loading logs</p>
        <p className="text-sm">
          If flags don't load, emojis should appear as fallback
        </p>
      </div>
    </div>
  );
};

export default FlagTest;
