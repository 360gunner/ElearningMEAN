const router = require('express').Router();
const Course = require('../models/course');

const aws = require('aws-sdk');
//to upload images we use multer (aws)
const multer = require('multer');
//to upload directly to aws s3 we use multers3 
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: "AKIAIBR5G5OP47EVSYJA", secretAccessKey: "mXU0TGX4NV0QXUsD2J8iwtJi9sSQmHSeEU9j2bqe" });



const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

//upload function to s3 to upload courses images
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'amazonowebapplication',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});



router.route('/courses')
  .get(checkJWT, (req, res, next) => {
    Course.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, courses) => {
        if (courses) {
          res.json({
            success: true,
            message: "courses",
            courses: courses
          });
        }
      });
  })
  .post([checkJWT, upload.single('course_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let course = new Course();
    course.owner = req.decoded.user._id;
    course.category = req.body.categoryId;
    course.title = req.body.title;
    course.price = req.body.price;
    course.description = req.body.description;
    course.image = req.file.location;
    course.save();
    res.json({
      success: true,
      message: 'Successfully Added the course'
    });
  });





module.exports = router;
