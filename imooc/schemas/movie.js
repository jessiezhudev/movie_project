// 建模工具模块
var mongoose = require("mongoose");

var MovieSchema = mongoose.Schema({
  director: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  meta:{
    createAt: {
      type: Date,
      Default: Date.now()
    },
    updateAt: {
      type: Date,
      Default: Date.now()
    }
  }
})
// 每次存储数据前都会调用该方法
MovieSchema.pre('save', function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else{
    this.meta.updateAt = Date.now()
  }
  next()
})
// 只有在model编译过后才具有这些方法
// 取出所有数据
MovieSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb){
    return this
      .findOne({_id: id})
      .exec(cb)
  },
}
module.exports = MovieSchema;
