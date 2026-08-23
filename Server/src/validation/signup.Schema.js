const{z}=require("zod");
const validateSignup=z.object({
  firstName:z.string().trim().min(2,"first name should contain at least 2 characters"),
  lastName:z.string().trim().optional(),
  emailId: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[@$!%*?&#]/, "Password must contain one special character"),
})
module.exports=validateSignup;