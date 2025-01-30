
import { Courses } from "../models/Course.js";   
import TryCatch from "../middlewares/TryCatch.js";  
import { Lecture } from "../models/Lecture.js";
import {rm} from 'fs';
import {promisify} from 'util';
import fs from 'fs';
import {User} from '../models/User.js'

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, price, createdBy, duration } = req.body;
  const image = req.file;
  console.log(image)
  console.log("Uploaded File in createCourse:", req.file); 
  console.log("Request Body in createCourse:", req.body);  

  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  }

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image.path,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});



export const addLectures =TryCatch(async(req,res)=>{
  const course =await Courses.findById(req.params.id)

  if(!course){
    return res.status(404).json({
      message:"No Courses with this id",
    });
  }
    const{title,description}=req.body

    const file=req.file
    const lecture= await Lecture.create({
      title,
      description,
      video:file?.path,
      course:course._id,
    })

    res.status(201).json({
      message :"Lecture Added",lecture,
    })
})

// export const deleteLecture = TryCatch(async(req,res)=>{
//   const lecture = await Lecture.findById(req.params.id)
  
//   rm(lecture.video,()=>{
//     console.log("Video Deleted")
//   })
//    await lecture.deleteOne();
//    res.json({message:"Lecture Deleted"});
// });

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

  if (lecture.video) {
    rm(lecture.video, (err) => {
      if (!err) {
        console.log("Video Deleted");
      }
    });
  }

  await lecture.deleteOne();
  res.json({ message: "Lecture Deleted" });
});


// const unlinkAsync=promisify(fs.unlink)

// export const deleteCourse = TryCatch(async(req,res)=>{
//   const course = await Courses.findById(req.params.id)
  
//   const lectures = await Lecture.find({course:course._id})
  
//   await Promise.all(lectures.map(async(lecture)=>{
//        await unlinkAsync(lecture.video);
//        console.log("Video Deleted");
//   }))
   
//   rm (course.image,()=>{
//     console.log("image Deleted")
//   })
//   await Lecture.find({course:req.params.id}).deleteMany()
//   await course.deleteOne()
//   await User.updateMany({},{$pull:{subscription:req.params.id}});

//   res.json({
//     message:"Course Delete",
//   })
// })

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const lectures = await Lecture.find({ course: course._id });

  // Delete all lecture videos if they exist
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.video) {
        await unlinkAsync(lecture.video);
        console.log("Video Deleted");
      }
    })
  );

  // Delete course image if it exists
  if (course.image) {
    rm(course.image, (err) => {
      if (!err) {
        console.log("Image Deleted");
      }
    });
  }

  // Delete lectures and course
  await Lecture.deleteMany({ course: req.params.id });
  await course.deleteOne();

  // Remove course from all users' subscriptions
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({
    message: "Course Deleted",
  });
});


export const getAllStats=TryCatch(async(req,res)=>{
  const totalCoures=(await Courses.find()).length;
  const totalLectures=(await Lecture.find()).length;
  const totalUsers =(await User.find()).length;

  const stats={
    totalCoures,
    totalLectures,
    totalUsers,
  }
  res.json({
    stats,
  })
})
