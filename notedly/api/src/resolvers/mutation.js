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
    }
};