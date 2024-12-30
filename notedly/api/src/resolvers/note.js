module.exports = {
  // 노트의 작성자 정보를 반환
  author: async (note, args, { models }) => {
    return await models.User.findById(note.author);
  },
  // 노트의 즐겨찾기 수를 반환
  favoritedBy: async (note, args, { models }) => {
    // $in : 쿼리 연산자 : 주어진 배열의 요소 중 하나라도 일치하는 문서를 반환
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  },
};
