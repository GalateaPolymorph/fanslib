export type HashtagMatch = {
  hashtag: string;
  start: number;
  end: number;
};

export const findHashtags = (text: string): HashtagMatch[] => {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  const matches: HashtagMatch[] = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    matches.push({
      hashtag: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return matches;
};
