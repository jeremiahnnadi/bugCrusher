const moment = require('moment');
const typeOf = require('kind-of');


module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format)
    },
    ifEquals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this)
    },
    eq: function(a, b, options) {
        if (arguments.length === 2) {
          options = b;
          b = options.hash.compare;
        }
        return util.value(a === b, this, options);
    },
    contains: function(a, b, opts) {

        if (b.includes(a)){
          return opts.fn(this);
        }
            
        else{
          return opts.inverse(this);
        }
            
    },
    select: function (selected, options) {
      return options
        .fn(this)
        .replace(
          new RegExp(' value="' + selected + '"'),
          '$& selected="selected"'
        )
        .replace(
          new RegExp('>' + selected + '</option>'),
          ' selected="selected"$&'
        )
  }
};