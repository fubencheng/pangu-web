const prefix = process.env.NODE_ENV === 'development' ? '/api' : '';

export default {
  fetch_category: prefix + '/qa/category/list',
  upload_question_image: prefix + '/qa/upload/question/image',
  save_question: prefix + '/qa/question/save',
  fetch_question_list: prefix + '/qa/question/list',
  sign_question: prefix + '/qa/question/sign',
  upload_answer_image: prefix + '/qa/upload/answer/image',
  fetch_question_detail: prefix + '/qa/question/detail',
  fetch_answer_list: prefix + '/qa/answer/list',

  save_answer: prefix + '/ask/answer/save',
  sign_answer: prefix + '/ask/answer/sign',
  fetch_answer_comment_list: prefix + '/ask/comment/list',
  save_comment: prefix + '/ask/comment/save',
  }
