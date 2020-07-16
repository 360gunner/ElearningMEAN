const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseAlgolia = require('mongoose-algolia');

const CourseSchema = new Schema({
  
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  owner:  { type: Schema.Types.ObjectId, ref: 'User'},
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
  image: String,
  title: String,
  description: String,
  price: Number,
  crated: { type: Date, default: Date.now }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

CourseSchema
  .virtual('averageRating')
  .get(function() {
    var rating = 0;
    if (this.reviews.length == 0) {
      rating = 0;
    } else {
      this.reviews.map((review) => {
        rating += review.rating;
      });
      rating = rating / this.reviews.length;
    }

    return rating;
  });

CourseSchema.plugin(deepPopulate);
CourseSchema.plugin(mongooseAlgolia, {
  appId: 'CO3GNO6BHL',
  apiKey: '3a4325e1bed03a2fa814393542dcbe61',
  indexName: 'Biapiv1',
  selector: '_id title image reviews description price owner crated averageRating',
  populate: {
    path: 'owner reviews',
    select: 'name rating'
  },
  defaults: {
    author: 'uknown'
  },
  mappings: {
    title: function(value) {
      return `${value}`
    }
  },
  virtuals: {
    averageRating: function(doc) {
      var rating = 0;
    if (doc.reviews.length == 0) {
      rating = 0;
    } else {
      doc.reviews.map((review) => {
        rating += review.rating;
      });
      rating = rating / doc.reviews.length;
    }

    return rating;
    }
  },
  debug: true
})
 

let Model =  mongoose.model('Course', CourseSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['title']
});
module.exports = Model


