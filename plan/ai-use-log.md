# AI Usage log

<hr />

### Log #1

#### Prompt:
Please do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/12
#### Thoughts
We are not sure wether the model actually read the AGENTS.md file, so we we want to explicitly tell the model to do so now to see if this changes anything.
Since this was like a setup iteration, we did not think updating our style of prompting yet.
<hr />
<hr />

### Log #2

#### Prompt:
Please do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/14. Remember to read the AGENTS.md file.
#### Thoughts
It was checking AGENTS.md so we can remove this for future iterations. This was another setup step from Codex because it had to setup the backend controllers, validators and routes. Himir went through the code and thought it looked professional enough. We noticed that our linting scheme was not checking typescript properly so for our next prompt we should fix this

<hr />
<hr />

### Log #3

#### Prompt:
Can you update the repository to check for typescript linting and we are getting these errors for the prs
#### Thoughts
When we tried to merge the pull requests we noticed that our code was always failing the typescript linting checks. Our code should not have been doing this, so we had codex help us on figuring this out. After we would resume with having it work on the github issues we made.
<hr />


### Log #4

#### Prompt:
Please do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/11. Remember to read the AGENTS.md file.
#### Thoughts
This was the first issue that involved making the frontened so we wanted to see how codex would design the frontend. For a first attempt, the frontend looking pretty drab and boring. But it was working correctly, so we could not complain about bugs. For future iterations, we should be more explicit on what asthetic and design choices it should be making.
Interestingly, It is using the Vite framework even though we did not specify it to do this.
<hr />

### Log #5

#### Prompt:
Can you modularize the styles please such that .tsx has its own styles.
#### Thoughts
In the spirit of clean code we wanted to modularize the code that codex was writing. In the AGENTS.md file we mentioned it should be doing this, but this would be a good reminder for it to uphold this standard.


<hr />

### Log #6

#### Prompt:
the login page is still in one file. Make one page for all login related items.
#### Thoughts
Spending two prompts here for modularizing might have been a waste, but we really wanted to impress that it should be using organizing its code a bit better so that it would make it easier for us to read if we needed too. The team was thinking that we should add scripts to be able to boot up the backend and frontend easily, so we decided the next prompt should be for this.


<hr />


### Log #7

#### Prompt:
add scripts to run the backend and connect the backend to the frontend using a fixed port
#### Thoughts
Codex did this with ease. However we had to figure out how to make logging into mongodb work and Himir was planning to setup the mongodb credentials to be able to do this.


<hr />
<hr />

### Log #8

#### Prompt:
can you connect to mongodb using this link
#### Thoughts
We ommited the link as this was meant for the .env variables which had Himirs mongodb login info. However we got setup with mongodb and checked it by making an account on our slot machine. It worked and we were ready now to continue with the last main github issue which was setting up the actual slot machine.


<hr />

### Log #9

#### Prompt:
Can you do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/15 and submit a pr after
#### Thoughts
This was the issue for the actual slot machine. The apearance of this slot machine was pretty bad, and did not follow the pictures we provided. We also noticed the symbols inside the actual slot machine were just words and were not rendering emojis or images. We thought this was a problem so we wanted to use our next iteration to adress this and make sure it uses emojis for the symbol.

<hr />
<hr />

### Log #10

#### Prompt:
Can you do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/15 and submit a pr after
#### Thoughts
This was the issue for the actual slot machine. The apearance of this slot machine was pretty bad, and did not follow the pictures we provided. We also noticed the symbols inside the actual slot machine were just words and were not rendering emojis or images. We thought this was a problem so we wanted to use our next iteration to adress this and make sure it uses emojis for the symbol. We also noticed that the 4x4 slot machine design was crowding the screen and we decided a 3x3 would be more manageable for the phone format as well (one of our user stories.)

<hr />
<hr />

### Log #11

#### Prompt:
can you make the symbols less big they crowd the screen. If you can just make a 3x3 slot machine instead of the current 4x4 since the last row can not fit on the screen

#### Thoughts
We decided to split the two concerns from our previous iteration and wanted to fix the crowding on the screen as this was making the UI look bad. Sure enough, the UI looked much less crowded. Now it was onto our next concern: make the symbols be emojis instead of abbreviated words

<hr />
<hr />

### Log #11

#### Prompt:
can you make them be icons and not just words, make them be emojis if you can use images

#### Thoughts
This made the abbreivated words be emojis. They did not look the best but we also noticed another issue. We could not adjust the betting amount. So we decided that we should focus on fixing the functionality now, and then worry about the look of the UI later.

<hr />
<hr />

### Log #12

#### Prompt:
can you allow the user to be able to change the bet amount as long as it does not exceed their balance

#### Thoughts
This fixed the issue. We now wanted to take a different approach for the UI. We will provide more examples of slot machines we want to emulate, and provided this in context to Codex. We will also experiment with writing a longer prompt, as our prompts prior were pretty short.



<hr />
<hr />

### Log #13

#### Prompt:
can you make the UI for the slot machine more like this image. We like the theme of the bacground a lot and the symbols in the slot machine are also cool. Do not change the login page, but give the slot machine more of this feel of slot machine.

#### Thoughts
The image in question was a slot machine we really liked on google. It was kind of a lava/volcanoe theme and liked the symbols on it a lot. We chose not to change the login page as right now we actually did not mind it and thought it was good as is. The aftermath was a little bit of a disaster. It did not emulate this slot machine but made the UI look a bit nicer. It is out of order again so next prompt should be spent fixing the symbols and making sure things are not overlapping over other things.



<hr />
<hr />

### Log #14

#### Prompt:
can you make the tiles fit on the screen, and also readjust the background because the text in the background is cut off by the tiles.

#### Thoughts
This made the symbols and other stuff fit nicely together and also the slot machine looked less crowded. However the UI still looked god awful. So we thought it would be a good idea to devise a new github issue to tackle this. But first we wante to start on the user stories, so we decided to devise a prompt for the leaderboard feature we wanted.


<hr />
<hr />

### Log #15

#### Prompt:
can you please do this issue, https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/28. Since ongodb is not working right now just make a leaderboard page, and also allow the user to be able to go to the leaderboard both from the login page and the actual slot machine page

#### Thoughts
We wrote the last part because at the time Matthew Bozoukov forgot that we needed .env file to be able to get mongodb to work. This was implemented succesfully and mongodb integration was created. We had one more main user story to knock out which was the prize page so now, we are making a prompt for the prize page.


<hr />
<hr />

### Log #16

#### Prompt:
Make a prize page where the user can buy enahnced luck for 1 hour or a cool new animation for when it wins. This new animation can be snow themed where snow starts falling once they win. For now let guests buy these things. Set enhanced luck to be 500 and snow theme to be 250.

#### Thoughts
These were placeholder prizes because we originally wanted to make prizes various slot machine themes or music tracks. We kinda liked the enhanced luck so decided to keep it. Next is the important challenge of fixing the UI. John is gonna handle making the issue for creating a new pirate themed slot machine. We think that the pirate theme is narrow enough for codex to be able to implement it pretty well. 

<hr />
<hr />

### Log #17

#### Prompt:
can you do this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/29. Check the assests folder for what the symbols in the slot machine should be. If you need other image assest let me know. Other then that follow the issues spec.


#### Thoughts
When we provide assets to the model(thanks to Felix), the model made a much a better ui. The slot machine has a much cleaner feel to it. However, it went back to the 4x4 format. Next prompt should be fixing this.

<hr />
<hr />

### Log #18

#### Prompt:
we cant see the 3x3 board can you adjust so it will fit on screen.


#### Thoughts
This fixed the akward crowding on our ui. We noticed that the counter was reverted back to its old state. We wanted to fix this in our next prompt. It added a counter when in reality we want the user to be able set the bet manually.
<hr />
<hr />

### Log #19

#### Prompt:
 Instead of counter to increase the bet, can you have a textbox that lets you type how much you want to be


#### Thoughts
This worked fine and functionality was what we expect. Now we want to full ramp up the pirate theme. We will spend a bit more time crafting a good prompt. We would like treasure animations when a user wins, we would like a more udner the sea feel for the background, and also made some ropes in the background, like being on a pirate ship.
<hr />
<hr />

### Log #20

#### Prompt:
Add some pirate-themed details to the UI to make it feel more immersive. Things like rope-style borders, wooden textures, compass icons, or an ocean/beach background would help. Small touches like subtle animations (e.g., waves moving, treasure sparkling, or a ship gently swaying) can go a long way. can you do this, specifically like a ship sailing anaimation whenever you win and also treasure sparkling. and add a compass icon between current bet and number of spins



#### Thoughts
1) did not add the rope-style borders, but added wooden textures and ocean/beach background. 2) Codex added trasure sparkling on the symbols and when the user won a jackpot, it added a ship sailing animation. also added a compass icon which was nice. We now want to add soundtracks to fullfill one of our user stories.
<hr />
<hr />

### Log #21

#### Prompt:
https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/33 this is the sound issue 



#### Thoughts
The original soundtrack it added was ok. The sounds when buttons clicked were ok, but we cant find better ones that are not copyright so we settled on this. Next we want to finish the prize tab to finish one of the last user stories we have not completed.
<hr />

<hr />

### Log #22

#### Prompt:
can you add these in the prizes and remove the snow. Have these both be 500 and let their user switch tracks if they have multiple sound tracks. so they should be able to switch between the default, and their bought ones. 




#### Thoughts
Matthew Bozoukov embedded some copyright free pirate tracks the user could buy to codex and codex implemented these pretty well. The switching feature was handled well and was clean to use.All that was left adding the animation assets and code that codex can implement.
<hr />

<hr />

### Log #23

#### Prompt:
can you implement this issue https://github.com/cse110-sp26-group08/one-arm-slot-machine-2/issues/30 in the current pr




#### Thoughts
Animations look good both for winning and idle animations for the symbols. The last thing we notice that is lacking is the login page. The login page is not up to date with the pirate theme and we want to fix this, so last thing codex should do is this.
<hr />
<hr />

### Log #24

#### Prompt:
can you update the login page to be more like the pirate theme. change the symbols on the login page with the symbols from the pirate slot machine. in the second image remove the "email with login cached..." and add "sign up now or login" and remove the last two bullets and replace with "you can also play as a guest". Do this on a new branch and then submit a pr




#### Thoughts
Codex did this well and we do not have any qualms with it. Looks like we have our final product!
<hr />





