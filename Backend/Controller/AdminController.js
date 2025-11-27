const titleSchema = require('../Model/Title_Model');
const subTitleSchema = require('../Model/Subtitle_Model');
const Auth_Model = require('../Model/Auth');
const { setAdmin } = require('../Utils/jwt');
const questionsShcema = require('../Model/Question_Model');
const { default: mongoose } = require('mongoose');




async function handleAdmin(req, res) {

     const {title, subTitle, question, answer, refTag} = req.body;

        try {
    
    
            const add_title = await titleSchema.create({title:title});
            const add_subTitle = await subTitleSchema.create({
                                        subTitle: subTitle,
                                        titleId: add_title._id
                                    })
    
            const add_question = await questionsShcema.create({
                                        titleId: add_title._id,
                                        subTitleId: add_subTitle._id,
                                        question: question,
                                        answer: answer,
                                        reference_tags: refTag,
                                    })
    
            res.status(201).json({
                message: "successful",
                status: true,
            })
    
    
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Problem",
                status: false,
            })
        }
    

}



async function handleGetAllQuestion(req, res) {

    console.log("We reached out to all question path.")

    try {
        // Using your Title model (titleSchema variable from earlier)
const pipeline = [
  {
    // Lookup subtopics for each title
    $lookup: {
      from: "subtitles",            // collection name for subTitle model (lowercase, plural)
      let: { titleId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$titleId", "$$titleId"] } } },
        // For each subtitle, lookup questions that reference it
        {
          $lookup: {
            from: "questions",      // collection name for questions model
            let: { subId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$subTitleId", "$$subId"] } } },
              // optional: remove foreign keys from question documents
              { $project: { subTitleId: 0, titleId: 0, __v: 0 } }
            ],
            as: "questions"
          }
        },
        // optional: drop the titleId field inside subtopic
        { $project: { titleId: 0, __v: 0 } }
      ],
      as: "subtopics"
    }
  },
  // optional: project only fields you want in top-level title docs
  { $project: { __v: 0 } }
];

       const titlesWithSubtopicsAndQuestions = await titleSchema.aggregate(pipeline).exec();

        res.status(200).json(titlesWithSubtopicsAndQuestions);

       

        

        
        
    } catch (error) {
        res.json({message: "internal rrror"+error , status: false})
    }

}




async function handleDeleteQuestion(req, res){

   const {delId} = req.body
  console.log("==== Delete Id SHow here ====")
  console.log(delId)

  try {

     const delTitle = await titleSchema.findOneAndDelete({_id: delId})

     const delSubTitle = await subTitleSchema.findOneAndDelete({titleId: delId})

     const delQuestion = await questionsShcema.findOneAndDelete({titleId: delId})

    res.status(200).json({message: "Question is deleted.", status: true});

    
  } catch (error) {
    res.status(500).json({message: "Internal Server Issue arises...", status: false})
  }

}




async function handleUpdate(req, res) {
   
      const {summary} = req.body;


        try {

          const test = await titleSchema.findByIdAndUpdate(summary.id, 
                                                          { $set: { title: summary.title }},
                                                        { new: true })
  
            

            const subTest = await subTitleSchema.findOneAndUpdate(
                                                      { titleId: summary.id },
                                                      { $set: { subTitle: summary.subTitle} },
                                                      { new: true }
                                                    );

    
            const quesTest = await questionsShcema.findOneAndUpdate(
                                        {titleId: summary.id },
                                       {
                                         $set: {
                                           question: summary.question,
                                           answer: summary.answer,
                                           titleId: summary.id,
                                           reference_tags: summary.refTag,
                                         }
                                       },
                                       { new: true }
                                     )

            res.status(200).json({mess: "sucess" , status: true,})
    
    
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Problem in Updatation",
                status: false,
            })
        }
    

}




async function handleLogout(req, res) {

   res.cookie("token", "");

    res.status(200)
       .json({message: "Logout Successful",
              status: true});

}





async function handleAuthentication(req, res){

           console.log("Auth Route run")

               const {email, password} = req.body

               console.log({email: email, pass: password})

               try {

                const checkAdmin = await Auth_Model.findOne({adminId: email})

                if(!checkAdmin){
                    return res.status(404)
                              .json({ message: "Invalid User Details", 
                                      status: false});
                }


                // const isPassword = await bcrypt.compare(password, checkAdmin.password);

                

                if(checkAdmin.password != password){
                     return res.status(400)
                               .json({ message: "Incorrect Password", 
                                       status: false});
                }


                const jwtToken = setAdmin(checkAdmin)

                res.cookie('token', jwtToken, { 
                              httpOnly: true, 
                              secure: true, 
                              sameSite: 'None', 
                              path: '/' }
                          );





        res.status(200)
           .json({message: "Login Successful",
                  status: true,
                  token: jwtToken,
                  user: checkAdmin.adminId})


                
               } catch (error) {
                console.log(error)
               }


}






module.exports = {
    handleAdmin,
    handleAuthentication,
    handleGetAllQuestion,
    handleDeleteQuestion,
    handleUpdate,
    handleLogout,
}