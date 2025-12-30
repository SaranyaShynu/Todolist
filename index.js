const express=require("express")
const {Pool}=require("pg")
const path=require("path")
const app=express()
app.use(express.json())
app.use(express.static("public"))

const pool=new Pool({
    user:"postgres",
    host:"localhost",
    database:"todo",
    password:"relationaldb",
    port:5432
})

/* app.get("/", (req,res)=>{
    res.send("Todo app is running 🚀")
}) */

//CREATE -Add todo
app.post("/todos",async(req,res)=>{
    const {title}=req.body
    try{
    const result=await pool.query(
        "INSERT INTO todos (title) VALUES ($1) RETURNING *",
        [title]
    )
    res.json(result.rows[0])
}
catch (err){
    res.status(500).send(err.message)
}
})

//READ- Get all todos
app.get("/todos",async(req,res)=>{
    try{
        const result =await pool.query("SELECT * FROM todos ORDER BY id ASC")
        res.json(result.rows)
    }
    catch (err){
        res.status(500).send(err.message)
    }
})

//READ - Get single todo by id
app.get("/todos/:id",async (req,res)=>{
    const {id}=req.params
    try{
        const result =await pool.query("SELECT * FROM todos WHERE id=$1",[id])
        if(result.rows.length===0){
            return res.status(404).send("Todo not found")
        }
        res.json(result.rows[0])
    }
    catch(err) {
        res.status(500).send(err.message)
    }
})

//UPDATE - Update todo by id
app.put("/todos/:id",async (req,res)=>{
    const {id}=req.params
    const {title,is_done}=req.body
    try{
       const result=await pool.query(
       "UPDATE todos SET title=$1,is_done=$2 WHERE id=$3 RETURNING *",
       [title,is_done,id]
       )
       if(result.rows.length===0){
        return res.status(404).send("Todo not found")
       }
       res.json(result.rows[0])
    }
    catch(err) {
        res.status(500).send(err.message)
    }
})

//DELETE - Delete todo by id
app.delete("/todos/:id",async (req,res)=>{
    const {id}=req.params
    try{
        const result=await pool.query("DELETE FROM todos WHERE ID=$1 RETURNING *",[id])
        if(result.rows.length===0){
            return res.status(404).send("Todo not found")
        }
        res.send(`Deleted todo with id ${id}`)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}) 

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000")
})