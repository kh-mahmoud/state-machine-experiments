import { createMachine } from 'xstate';

export const testMachine = createMachine({
 initial:'idle',
 states:{
   idle:{
     on:{
         LOAD:{
            target:'loading'
         }
     }
   },
   loading:{
    on:{
        IDLE:{
           target:'idle'
        }
    }
   },
 }
});
