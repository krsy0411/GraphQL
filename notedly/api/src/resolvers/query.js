module.exports = {
  hello: () => 'Hello World!',
  notes: async (parent, args, { models }) => {
    // 모든 문서를 검색
    return await models.Note.find();
  },
  note: async (parent, args, { models }) => {
    // 인자로 받은 ID를 사용하여 특정 Note를 찾음
    return await models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    // 인자로 받은 username을 사용하여 특정 User를 찾음
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    // 모든 문서를 검색
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    // context에 user가 있으면 user를 반환
    return await models.User.findById(user.id);
  },
};
