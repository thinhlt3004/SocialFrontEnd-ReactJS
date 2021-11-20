import './emojifeeling.css'

export default function EmojiFeeling({handleFeelings}) {
    
    return (
        <div className="feelings">
            <option onClick={(e) => handleFeelings('Feeling Happy')} className="optionFeelings">&#128541; Feeling Happy</option>
            <option  onClick={(e) => handleFeelings('Feeling Sad')} className="optionFeelings">&#128557; Feeling Sad</option>
            <option  onClick={(e) => handleFeelings('Feeling Funny')} className="optionFeelings">&#128514; Feeling Funny</option>
            <option  onClick={(e) => handleFeelings('Feeling Crazy')} className="optionFeelings">&#129322; Feeling Crazy</option>
            <option  onClick={(e) => handleFeelings('Feeling Love')} className="optionFeelings">&#128536; Feeling Love</option>
            <option  onClick={(e) => handleFeelings('Feeling Wonderful')} className="optionFeelings">&#128519; Feeling Wonderful</option>
            <option  onClick={(e) => handleFeelings('Feeling Angry')} className="optionFeelings">&#129324; Feeling Angry</option>
            <option  onClick={(e) => handleFeelings('Feeling OK')} className="optionFeelings">&#128513; Feeling OK</option>
          
        </div>
    )
}
