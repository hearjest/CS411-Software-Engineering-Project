const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.KEY,
  }),
  serviceUrl: process.env.URL,
});

let thing='From #1 New York Times bestselling author Brandon Sanderson, Words of Radiance, Book Two of the Stormlight Archive, continues the immersive fantasy epic that The Way of Kings began. Expected by his enemies to die the miserable death of a military slave, Kaladin survived to be given command of the royal bodyguards, a controversial first for a low-status darkeyes. Now he must protect the king and Dalinar from every common peril as well as the distinctly uncommon threat of the Assassin, all while secretly struggling to master remarkable new powers that are somehow linked to his honorspren, Syl. The Assassin, Szeth, is active again, murdering rulers all over the world of Roshar, using his baffling powers to thwart every bodyguard and elude all pursuers. Among his prime targets is Highprince Dalinar, widely considered the power behind the Alethi throne. His leading role in the war would seem reason enough, but the Assassins master has much deeper motives. Brilliant but troubled Shallan strives along a parallel path. Despite being broken in ways she refuses to acknowledge, she bears a terrible burden: to somehow prevent the return of the legendary Voidbringers and the civilization-ending Desolation that will follow. The secrets she needs can be found at the Shattered Plains, but just arriving there proves more difficult than she could have imagined. Meanwhile, at the heart of the Shattered Plains, the Parshendi are making an epochal decision. Hard pressed by years of Alethi attacks, their numbers ever shrinking, they are convinced by their war leader, Eshonai, to risk everything on a desperate gamble with the very supernatural forces they once fled. The possible consequences for Parshendi and humans alike, indeed, for Roshar itself, are as dangerous as they are incalculable. Other Tor books by Brandon Sanderson The Cosmere The Stormlight Archive The Way of Kings Words of Radiance Edgedancer (Novella) Oathbringer The Mistborn trilogy Mistborn: The Final Empire The Well of Ascension The Hero of Ages Mistborn: The Wax and Wayne series Alloy of Law Shadows of Self Bands of Mourning Collection Arcanum Unbounded Other Cosmere novels Elantris Warbreaker The Alcatraz vs. the Evil Librarians series Alcatraz vs. the Evil Librarians The Scriveners Bones The Knights of Crystallia The Shattered Lens The Dark Talent The Rithmatist series The Rithmatist Other books by Brandon Sanderson The Reckoners Steelheart Firefight Calamity At the Publishers request, this title is being sold without Digital Rights Management Software (DRM) applied';

const analyzeParams = {
    'html': thing,
    'features': {
        'keywords': {
            'emotion': true
          }
    }
  };

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
    let emotionsList=analysisResults["result"]["keywords"];
    let counter=[["sadness",0],["joy",0],["fear",0],["disgust",0],["anger",0]];
    emotionsList.forEach((key)=>{
      emo=key["emotion"]
      counter[0][1]+=emo["sadness"]
      counter[1][1]+=emo["joy"]
      counter[2][1]+=emo["fear"]
      counter[3][1]+=emo["disgust"]
      counter[4][1]+=emo["anger"]
    })
    console.log(counter);

  })
  .catch(err => {
    console.log('error:', err);
  });

  module.export=naturalLanguageUnderstanding;