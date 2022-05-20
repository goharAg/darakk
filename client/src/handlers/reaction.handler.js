const emojiCombine = (emojis) => {
  emojis.forEach((emoji) => {
    if (emoji.count) return;
    emoji.count = 1;
    emoji.usersStr = `${emoji.user.first_name} ${emoji.user.last_name}`;
  });
  for (let i = 0; i < emojis.length; i++) {
    if (!emojis[i]) continue;
    for (let j = i + 1; j < emojis.length; j++) {
      if (!emojis[j]) continue;
      if (emojis[i].emoji.unified === emojis[j].emoji.unified) {
        emojis[i] = {
          id: Math.floor(Math.random() * 90000) + 10000,
          count: emojis[i].count + emojis[j].count,
          usersStr: `${emojis[i].usersStr} \n${emojis[j].usersStr}`,
          emoji: emojis[i].emoji,
        };
        emojis[j] = false;
      }
    }
  }
  emojis = emojis.filter((x) => !!x);
  return emojis;
};

const emojiUnCombine = (emojis, removedEmoji, user) => {
  removedEmoji.usersStr = `${user.first_name} ${user.last_name}`;
  for (let j = 0; j < emojis.length; j++) {
    if (removedEmoji.unified === emojis[j].emoji.unified) {
      emojis[j].count -= 1;
      emojis[j].usersStr = emojis[j].usersStr.replace(removedEmoji.usersStr, '');
      emojis[j].usersStr = emojis[j].usersStr.replace(/(\r\n|\n|\r)/gm, '');
    }
  }
  return emojis;
};

export { emojiCombine, emojiUnCombine };
