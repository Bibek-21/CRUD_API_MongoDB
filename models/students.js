module.exports = mongoose => {
    const Students = mongoose.model(
        "students",
        mongoose.Schema(
            {
                FirstName: String,
                LastName: String,
                CRN: Number,
                Contact: Number,
                DOB: Date,
                Guardian: String,
                Address:String,
                IsDeleted: Boolean,


            },
            { timestamps: true }
        )
    );

    return Students;
};