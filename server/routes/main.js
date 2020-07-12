const router = require('express').Router();
const async = require('async');
const stripe = require('stripe')('sk_test_JF4CoY7UAKFnkwzNgh1NtXDV');


const Category = require('../models/category');
const Course = require('../models/course');
const Review = require('../models/review');
const Order = require('../models/order');

const checkJWT = require('../middlewares/check-jwt');

router
/*
.get('/courses', (req, res, next) => {
  const perPage = 10;
  const page = req.query.page;
  async.parallel([
    function(callback) {
      Course.count({}, (err, count) => {
        var totalCourses = count;
        callback(err, totalCourses);
      });
    },
    function(callback) {
      Course.find({})
        .skip(perPage * page)
        .limit(perPage)
        .populate('category')
        .populate('owner')
        .exec((err, courses) => {
          if(err) return next(err);
          callback(err, courses);
        });
    }
  ], function(err, results) {
    var totalCourses = results[0];
    var courses = results[1];
   
    res.json({
      success: true,
      message: 'category',
      courses: courses,
      totalCourses: totalcourses,
      pages: Math.ceil(totalCourses / perPage)
    });
  });
  
});
*/
.get('/Courses',(req, res, next) => {
  Course.find({}, (err, courses) => {
    res.json({
      success: true,
      message: "Success",
      courses: courses
    })
  })
})

router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: "Success",
        categories: categories
      })
    })
  })
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: "Successful"
    });
  });


  router.get('/categories/:id', (req, res, next) => {
    const perPage = 10;
    const page = req.query.page;
    async.parallel([
      function(callback) {
        course.count({ category: req.params.id }, (err, count) => {
          var totalCourses = count;
          callback(err, totalCourses);
        });
      },
      function(callback) {
        course.find({ category: req.params.id })
          .populate('category')
          .populate('owner')
          .populate('reviews')
          .exec((err, courses) => {
            if(err) return next(err);
            callback(err, courses);
          });
      },
      function(callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
         callback(err, category)
        });
      }
    ], function(err, results) {
      var totalCourses = results[0];
      var courses = results[1];
      var category = results[2];
      res.json({
        success: true,
        message: 'category',
        courses: courses,
        categoryName: category.name,
        totalCourses: totalcourses,
        pages: Math.ceil(totalCourses / perPage)
      });
    });
    
  });

  router.get('/course/:id', (req, res, next) => {
    course.findById({ _id: req.params.id })
      .populate('category')
      .populate('owner')
      .deepPopulate('reviews.owner')
      .exec((err, course) => {
        if (err) {
          res.json({
            success: false,
            message: 'Course is not found'
          });
        } else {
          if (course) {
            res.json({
              success: true,
              course: course
            });
          }
        }
      });
  });


  router.post('/review', checkJWT, (req, res, next) => {
    async.waterfall([
      function(callback) {
        course.findOne({ _id: req.body.courseId}, (err, course) => {
          if (course) {
            callback(err, course);
          }
        });
      },
      function(course) {
        let review = new Review();
        review.owner = req.decoded.user._id;

        if (req.body.title) review.title = req.body.title;
        if (req.body.description) review.description = req.body.description
        review.rating = req.body.rating;

        course.reviews.push(review._id);
        course.save();
        review.save();
        res.json({
          success: true,
          message: "Successfully added the review"
        });
      }
    ]);
  });


router.post('/payment', checkJWT, (req, res, next) => {
  const stripeToken = req.body.stripeToken;
  const currentCharges = Math.round(req.body.totalPrice * 100);

  stripe.customers
    .create({
      source: stripeToken.id
    })
    .then(function(customer) {
      return stripe.charges.create({
        amount: currentCharges,
        currency: 'usd',
        customer: customer.id
      });
    })
    .then(function(charge) {
      const courses = req.body.courses;

      let order = new Order();
      order.owner = req.decoded.user._id;
      order.totalPrice = currentCharges;
      
      courses.map(course => {
        order.courses.push({
          course: course.course,
          quantity: course.quantity
        });
      });

      order.save();
      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    });
});

 
module.exports = router;


