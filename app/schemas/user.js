let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now(),
        },
    },
});

UserSchema.pre('save', function(next) {
    let user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });
});

//实例方法，只有在实例中才能调用
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        })
    }
};


//静态方法，在模型中就可以调用
UserSchema.statics = {
    fetch: function(cb) {
        return this.find({})
        .sort('meta.updateAt')
        .exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({_id: id})
        .exec(cb);
    },
};

module.exports = UserSchema;