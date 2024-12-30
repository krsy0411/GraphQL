module.exports = {
  // 사용자의 노트 목록을 반환
  notes: async (user, args, { models }) => {
    // 사용자 ID로 노트들을 검색 : 내림차순 정렬(_id 필드 기준)
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },
  // 사용자의 즐겨찾기 목록을 반환
  favorites: async (user, args, { models }) => {
    // 사용자 ID로 즐겨찾기들을 검색 : 내림차순 정렬(_id 필드 기준)
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};
