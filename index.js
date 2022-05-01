const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const PENDING = 'pending';

class PromiseImp {
    constructor(executor){
        this.state = PENDING;
        this.result = undefined;
        this.onFulfilledFn = [];
        this.onRejectedFn = [];

        const resolve = (value) => {
            if(this.state === PENDING){
                this.state = FULFILLED;
                this.result = value;
                this.onFulfilledFn.forEach((cb)=>{
                    cb(value);
                });
            }
        };

        const reject = (error) => {
            if(this.state === PENDING){
                this.state = REJECTED;
                this.result = error;
                this.onRejectedFn.forEach((cb)=>{
                    cb(error);
                })
            }
        };

        try{
            executor(resolve,reject);
        }
        catch(error){
            reject(error);
        }
    }

    then(onFulfilled,onRejected){
        return new PromiseImp((resolve,reject)=>{
            if(this.state === PENDING){
                if(onFulfilled){
                 this.onFulfilledFn.push(()=>{
                    try{
                        const newResult = onFulfilled(this.result);
                        if(newResult instanceof PromiseImp){
                            newResult.then(resolve,reject);
                        }else{
                            resolve(newResult);
                        }
                       
                    }catch(error){
                        reject(error);
                    }
                 });
                }
                if(onRejected){
                 this.onRejectedFn.push(()=>{
                    try{
                        const newResult = onRejected(this.result);
                        if(newResult instanceof PromiseImp){
                            newResult.then(resolve,reject);
                        }else{
                            reject(newResult);
                        }                    
                    }catch(error){
                        reject(error);
                    }
                });
                }
                return;
             }
            if(onFulfilled && this.state === FULFILLED){
                onFulfilled(()=>{
                    try{
                        const newResult = onFulfilled(this.result);
                        if(newResult instanceof PromiseImp){
                            newResult.then(resolve,reject);
                        }else{
                            resolve(newResult);
                        }                
                    }catch(error){
                        reject(error);
                    }
                });
                return;
            }
            if(onRejected && this.state === REJECTED){
                onRejected(()=>{
                    try{
                        const newResult = onFulfilled(this.result);
                        if(newResult instanceof PromiseImp){
                            newResult.then(resolve,reject);
                        }else{
                            reject(newResult);
                        }                   
                    }catch(error){
                        reject(error);
                    }
                });
                return;
            }
        }); 
    }

    catch(onRejected){
        return this.then(null,onRejected);
    }
}


// 1. with constructor(executor) we can execute or change the state

// const promise = new PromiseImp((resolve,reject) => {
//     console.log()
//     resolve('success');
// });

// console.log(promise);

// 2. pending

// const promise = new PromiseImp((resolve,reject) => {
//     setTimeout(()=>{resolve('success')},1000)
// });

// console.log(promise);

// 3. reject

// const promise = new PromiseImp((resolve,reject) => {
//     setTimeout(()=>{reject('error')},500);
//     setTimeout(()=>{resolve('success')},2000);
//     resolve('success');
// }).then((value) => {
//     console.log(value)
// })

// setTimeout(()=>{
//     console.log(promise)
// },1500)

// 4. method "then" to catch the error

// const promise = new PromiseImp((resolve,reject) => {
//     setTimeout(()=>{reject(new Error('error in syntax'))},1000);
// }).then((value) => {
//     console.log(value);
// },(error) => {
//     console.log(error)
// })

// setTimeout(()=>{
//     console.log(promise)
// },1500)

// 5. method "catch" to catch the error

// const promise = new PromiseImp((resolve,reject) => {
//     setTimeout(()=>{reject(new Error('error in syntax'))},1000);
// }).catch((error) => {
//     console.log(error);
// });

// setTimeout(()=>{
//     console.log(promise)
// },1500)

// 6. Able to call then many times in one promise

const promise = new PromiseImp((resolve,reject) => {
    setTimeout(()=>{resolve('success')},1000);
}).then((val)=>{
   return val + ' first'
}).then((val)=>{
    return val + ' second'
}).then((val)=>{
    return val + ' third'
}).then((value)=>{
    console.log(value)
})

setTimeout(()=>{
    console.log(promise)
},1500)