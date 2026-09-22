const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    couponName: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
      default: "",
    },
    couponCode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: false,
    },
    endTime: {
      type: Date,
      required: false,
    },
    fromDate: {
      type: Date,
      required: false,
    },
    toDate: {
      type: Date,
      required: false,
    },
    discountPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: false,
      default: 0,
    },
    minimumAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    productType: {
      type: String,
      required: false,
      default: "all",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
