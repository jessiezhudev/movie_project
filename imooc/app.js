var express = require("express")
var path = require("path")
var mongoose = require("mongoose")
var _ = require("underscore")
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
// 传入我们设置的环境变量参数 否则默认3000
var port = process.env.PORT || 3000
// 启动一个web服务器
var app = express()
mongoose.connect('mongodb://localhost/imooc')
var Movie = require('./models/movie')
// 设置根目录
app.set('views', "./views/pages")
// 设置默认的模板引擎
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require("moment")
app.listen(port)
console.log('imooc started on port ' + port)
app.get('/', function(req,res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
    }
    res.render('index', {
      title:'imooc',
      movies:movies
    })
  })

})
app.get('/movie/:id', function(req,res){
  var id = req.params.id
  Movie.findById(id, function(err, movie){
    res.render('detail', {
      'title':'imooc' + movie.title,
      'movie':movie
    })
  })
})
app.get('/admin/movie', function(req,res){
  res.render('admin', {
    'title':'imooc后台录入页',
    'movie':{
      'title': '',
      'poster': '',
      'flash': '',
      'director': '',
      'country': '',
      'language': '',
      'year': '',
      'summary': ''
    }
  })
})
//admin update movie 列表页点更新更新电影。
app.get('/admin/update/:id', function(req,res){
  var id = req.params.id
  if (id) {
    Movie.findById(id, function(err, movie){
      res.render('admin', {
        title:'imooc 后台更新页',
        movie: movie
        }
      )
    })
  }
})
//admin post movie 表单提交后电影数据的存储
app.post("/admin/movie/new", function(req, res){
  // id可能是新加的或是更新过的
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie
  if (id!== "undefined"){
    Movie.findById(id,function(err, movie){
      if(err){
        console.log(err)
      }
      // 替换老对象
      _movie = _.extend(movie, movieObj)
      // movie为新拿到的movie
      _movie.save(function(err, movie){
         if(err){
              console.log(err)
          }
          // 转入新加入的movie详情页
          res.redirect("/movie/" + movie._id)

      })
    })
  }
  else{
    _movie = new Movie({
      director: movieObj.director,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    _movie.save(function(err, movie){
     if(err){
          console.log(err)
      }
      // 转入新加入的movie详情页
      res.redirect("/movie/" + movie._id)
    })
  }
})

app.get('/admin/list', function(req,res){
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
    }
    res.render('list', {
      title:'imooc列表页',
      movies:movies
    })
  })
})
//list delete movie
app.delete('/admin/list', function(req,res){
  var id = req.query.id
  if (id) {
    Movie.remove({_id: id}, function(err, movie){
        if(err){
          console.log(err)
        }
        else{
          res.json({success: 1})
        }
      }
    )
  }
})
