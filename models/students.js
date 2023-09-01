module.exports = mongoose => {
    let schema = 
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
    ;
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });
    
      const Students = mongoose.model("Students", schema);
      return Students;
    
};