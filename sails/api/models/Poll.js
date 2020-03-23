module.exports = {
  tableName: 'poll',
  primaryKey: 'id',
  attributes: {
    id: { type: 'number', autoIncrement: true, unique: true, columnName: 'id' },
    postId: { type: 'number', columnName: 'post_id' },
    answerId: { type: 'number', columnName: 'answer_id' },
    votes: { type: 'number', columnName: 'vote', defaultsTo: 0 }
  }
};
