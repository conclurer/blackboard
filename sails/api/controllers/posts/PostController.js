/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var DefaultDueDates = require('../../../../configuration/DefaultDisplayTimes');
module.exports = {
  newPost: async function(req, res){
    // 'Bad Reqest' Responses when information is missing from the API Request
    // No title specified
    if(!req.param('title')){
      return res.badRequest(new Error('Title of post has to be specified'));
    }
    // Title has invalid length (not 3-50 characters)
    if(req.param('title').length < 3 || req.param('title').length > 50){
      return res.badRequest(new Error('Title too long or too short'));
    }
    // Type does not match
    if(![
      'application/calendar',
      'application/msword',
      'application/note',
      'application/pdf',
      'application/poll',
      'application/survey',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ].includes(req.param('typeOfPost'))){
      return res.badRequest(new Error('Invalid type'));
    }
    // Due date already expired
    if(req.param('dueDate') && req.param('dueDate') < Date.now()){
      return res.badRequest(new Error('Invalid due date'));
    }

    // Set default due date when no date is given
    var uDueDate = Date.now();
    var t = 0;
    if(!req.param('dueDate')){
      // TODO Set to default times
      // For now, default times are stored in root/configuration(DefaultDisplayTime.js) in hours
      switch(req.param('typeOfPost')){
        case 'application/calendar':
          t = DefaultDueDates.DisplayTime.CALENDAR;
          break;
        case 'application/vnd.ms-excel':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/vnd.ms-powerpoint':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/msword':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          t = DefaultDueDates.DisplayTime.OFFICEFILE;
          break;
        case 'application/note':
          t = DefaultDueDates.DisplayTime.NOTE;
          break;
        case 'application/pdf':
          t = DefaultDueDates.DisplayTime.PDF;
          break;
        case 'application/poll':
          t = DefaultDueDates.DisplayTime.POLL;
          break;
        case 'application/survey':
          t = DefaultDueDates.DisplayTime.SURVEY;
          break;
        case 'image/jpeg':
          t = DefaultDueDates.DisplayTime.IMAGE;
          break;
        case 'image/png':
          t = DefaultDueDates.DisplayTime.IMAGE;
          break;
        default:
          return res.badRequest(new Error('Type mismatch between post type, and default time types'));
      }
      uDueDate = Date.now() + t*(60*60*1000);
    }
    // When type is not interactive, set interactive time to 0
    // When interactive time is already expired, return bad request
    var uInteractiveDueDate = 0;
    if(req.param('interactiveDueDate')){
      if([
        'application/calendar',
        'application/poll',
        'application/survey'
      ].includes(req.param('typeOfPost'))){
        if(req.param('interactiveDueDate') < Date.now()){
          return res.badRequest(new Error('Invalid interactive due date'));
        }
        uInteractiveDueDate = req.param('interactiveDueDate');
      }
    // Set default interactive due date when no date is given, and the post is of interactive type
    } else {
      // TODO Set to default times
      // For now, default times are stored in root/configuration(DefaultDisplayTime.js) in hours
      switch(req.param('typeOfPost')){
        case 'application/calendar':
          t = DefaultDueDates.ActiveTime.CALENDAR;
          break;
        case 'application/poll':
          t = DefaultDueDates.ActiveTime.POLL;
          break;
        case 'application/survey':
          t = DefaultDueDates.ActiveTime.SURVEY;
          break;
        default:
          t = 0;
      }
      if(t === 0){ uInteractiveDueDate = 0;}
      else { uInteractiveDueDate = Date.now() + t*(60*60*1000); }
    }

    sails.log.debug('Creating new Post . . .');
    // Create entry in 'post' table
    var createdPost = await Post.create({
      typeOfPost: req.param('typeOfPost'),
      title: req.param('title'),
      content: req.param('content'),
      dueDate: uDueDate,
      interactiveDueDate: uInteractiveDueDate
    }).fetch();
    // Create entry in 'post_location' table
    await PostLocation.create({
      boardId: req.param('boardId'),
      postId: createdPost.id
    });
    return res.json(JSON.stringify(createdPost));
  },


  getPost: async function(req, res){
    sails.log.debug('Fetching Post #' + req.param('postId'));
    var pst = await Post.findOne({id: req.param('postId')});
    // Return 'not found' response when postId does not match any existing post
    if(!pst){ return res.notFound(); }
    return res.json(JSON.stringify(pst));
  },


  searchPost: async function(req, res){
    sails.log.debug('Fetching Posts from board #' + req.param('boardId'));

    var overdue = Date.now();
    if(req.param('overdueDays') && !isNaN(req.param('overdueDays')) && req.param('overdueDays') >= 0){
      overdue = Date.now() - req.param('overdueDays')*(24*60*60*1000);
    }

    var idList = await PostLocation.find({
      where: {boardId: req.param('boardId')},
      select: ['postId']
    });
    var postList = [];
    var c = 0;
    for(var i=0; i<idList.length; i++){
      var pst = await Post.findOne({
        id: idList[i].postId,
        dueDate: { '>' : overdue }
      });
      if(pst){
        postList[c] = pst;
        c++;
      }
    }
    return res.json(JSON.stringify(postList));
  },


  deletePost: async function(req, res) {
    sails.log.debug('Trying to delete post #' + req.param('postId'));
    await Post.destroy({id: req.param('postId')});
    return res.ok();
  },


  updatePost: async function(req, res) {
    req = req;
    return res.ok();
  }
};
