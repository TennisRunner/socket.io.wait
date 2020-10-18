# socket.io.wait
Adds a promise to emit in socket.io

```javascript
// Lets you emit and get a response rather than make a second
// callback to listen for the result
let result = await socket.emitWait("get_data", 123, 456);

for(let row of result.rows)
{
  console.log("The name is " + row.name + " and value is " + row.value);
}



// old way

socket.on("get_data_result", function(result) 
{
  for(let row of result.rows)
  {
    console.log("The name is " + row.name + " and value is " + row.value);
  }
});

socket.emit("get_data", 123, 456);
```
