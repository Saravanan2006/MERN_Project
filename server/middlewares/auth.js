// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";
// export const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization; 
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
//         req.user = decoded; 
//         next(); 
//     } catch (error) {
//         res.status(403).json({ message: "Invalid or expired token" });
//     }
// };

// export const isAuth=async(req,res,next)=>{
//     try {
//         const token =req.headers.token;
//         if(!token){
//             res.status(403).json({message:"Please Login"})
//         }
//         const decodedData=jwt.verify(token,process.env.JWT_SECRET_KEY);
//         req.myprofileuser =await User.findById(decodedData._id)
//     } catch (error) {
//         res.status(500).json({message:"Login First"})
        
//     }
// }


// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js"; // Import User model

// export const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

  
//     if (!token) {
//       return res.status(401).json({ message: "Access Denied. No token provided" });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
//       console.log("Decoded Token:", decoded); // Debug log
//       req.user = decoded; // Set `decoded` payload to `req.user`
//       next(); // Proceed to the next middleware or controller
//     } catch (error) {
//       console.error("Auth Middleware Error:", error);
//       res.status(403).json({ message: "Invalid or expired token" });
//     }
//   };
  
// export const isAuth = async (req, res, next) => {
//     try {
//       // Get token from either 'Authorization' header or 'token' header
//       const authHeader = req.headers.authorization;
//       const token = authHeader?.split(" ")[1] || req.headers.token;
  
//       if (!token) {
//         return res.status(403).json({ message: "Please login" });
//       }
  
//       // Verify the token
//       const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
//       // Attach user data to the request
//       req.myprofileuser = await User.findById(decodedData.id);
//       if (!req.myprofileuser) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       next(); // Continue to the next middleware or route
//     } catch (error) {
//       console.error("Auth Middleware Error:", error);
//       res.status(403).json({ message: "Invalid or expired token" });
      
//     }
//   };
  





import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] || req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token in authMiddleware:", decoded); 
    req.user = decoded; 
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// export const isAuth = async (req, res, next) => {
//   try {
//     // Check for token in `Authorization` header, `token` header, or `req.query`
//     const authHeader = req.headers.authorization;
//     const token =  
//       authHeader?.split(" ")[1] || req.headers.token || req.query.token;

//     if (!token) {
//       return res.status(403).json({ message: "Please login" });
//     }

//     // Verify the token
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     console.log("Decoded Data in isAuth Middleware:", decodedData); // Debug log

//     // Attach user data to the request
//     const user = await User.findById(decodedData.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user; // Attach user to req
//     next();
//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);
//     res.status(403).json({ message: "Invalid or expired token" });
//   }
// };



//correct code

export const isAuth = async (req, res, next) => {
  try {
    // Extract the Authorization token
    const token = req.headers.authorization;
    console.log("Token:", token);

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract the actual token if it follows 'Bearer <token>' format
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    console.log("Extracted Token:", actualToken);

    // Verify the token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
    
    // Fetch user from DB (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



// export const isAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization; // ✅ Correct header
//     console.log("Auth Header:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(403).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // ✅ Extract token after "Bearer"
//     console.log("Extracted Token:", token);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };





export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User information not found." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied. You are not an admin." });
    }

    next();
  } catch (error) {
    console.error("isAdmin Middleware Error:", error.message);
    res.status(500).json({ message: "An error occurred while verifying admin access." });
  }
};

  