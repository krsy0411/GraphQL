module.exports = {
    newNote: async (parent, args, { models }) => {
        // let newNoteObject = {
        //     id: String(notes.length + 1),
        //     content: args.content,
        //     author: "Adam Scott"
        // }
        // notes.push(newNoteObject);

        return await models.Note.create({
            content: args.content,
            author: "Adam Scott"
        })
    },
    updateNote: async (parent, { content, id}, { models }) => {
        // mongoose의 findOneAndUpdate메소드에 3가지 옵션 내용 인자로 전달
        return await models.Note.findOneAndUpdate(
            // 조건 객체(filter) : _id가 id와 일치하는 데이터를 찾아냄 : 인자로 받은 id를 데이터 서칭에 사용
            { _id: id },
            // 수정 객체(update) : 업데이트할 내용을 정의
            {
                // $set 연산자 : 필드를 업데이트할 값을 지정 : 이번 예시엔 content를 업데이트
                $set: {
                    content
                }
            },
            // 옵션 객체(options) : 업데이트 작업의 옵션을 정의 -> new: true를 설정하여 업데이트된 문서를 반환하도록 지정
            // 기본적으로 findOneAndUpdate() 메서드는 업데이트 이전의 문서를 반환
            { new: true }
        )
    },
    deleteNote: async (parent, { id }, { models }) => {
        try {
            // mongoose에서 findOneAndRemove가 사라진건가? : findOneAndRemove는 함수가 아니라고 로그 찍힘
            // 참고 : https://how-can-i.tistory.com/81
            await models.Note.findOneAndDelete({ _id : id });
            return true;
        } catch(error) {
            return false;
        }
    }
};