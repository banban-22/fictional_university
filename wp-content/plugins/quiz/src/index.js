import './index.scss';
import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon,
  PanelBody,
  PanelRow,
  ColorPicker,
} from '@wordpress/components';
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';
import { ChromePicker } from 'react-color';

function ourStartFunction() {
  let locked = false;

  wp.data.subscribe(function () {
    const results = wp.data
      .select('core/block-editor')
      .getBlocks()
      .filter(
        (block) =>
          block.name === 'ourplugin/are-you-paying-attention' &&
          block.attributes.correctAnswer == undefined
      );

    if (results.length && !locked) {
      locked = true;
      wp.data.dispatch('core/editor').lockPostSaving('noanswer');
    }

    if (!results.length && locked) {
      locked = false;
      wp.data.dispatch('core/editor').unlockPostSaving('noanswer');
    }
  });
}

ourStartFunction();

wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
  title: 'Are you paying attention?',
  icon: 'smiley',
  category: 'common',
  attributes: {
    question: { type: 'string' },
    answers: { type: 'array', default: [''] },
    correctAnswer: { type: 'number', default: undefined },
    bgColor: { type: 'string', default: '#ebebeb' },
    theAlignment: { type: 'string', default: 'left' },
  },
  description: 'Give your audience a change to prove their comprehension.',
  example: {
    attributes: {
      question: 'What is my name?',
      correctAnswer: 3,
      answers: ['Meowsalot', 'Barksalot', 'Purrsloud', 'Brad'],
      theAlignment: 'center',
      bgColor: '#cfe8f1',
    },
  },
  edit: EditComponent,
  save: function (props) {
    return null;
  },
});

function EditComponent(props) {
  function updateQuestion(value) {
    props.setAttributes({ question: value });
  }

  function updateAnswer(index, newValue) {
    const newAnswers = [...props.attributes.answers];
    newAnswers[index] = newValue;
    props.setAttributes({ answers: newAnswers });
  }

  function deleteAnswer(index) {
    const newAnswers = props.attributes.answers.filter((_, i) => i !== index);
    props.setAttributes({ answers: newAnswers });

    if (props.attributes.correctAnswer === index) {
      props.setAttributes({ correctAnswer: undefined });
    }
  }

  function markAsCorrect(index) {
    props.setAttributes({ correctAnswer: index });
  }

  return (
    <div
      className="paying-attention-edit-block"
      style={{ backgroundColor: props.attributes.bgColor }}
    >
      <BlockControls>
        <AlignmentToolbar
          value={props.attributes.theAlignment}
          onChange={(x) => props.setAttributes({ theAlignment: x })}
        />
      </BlockControls>
      <InspectorControls>
        <PanelBody title="Background Color" initialOpen={true}>
          <PanelRow>
            <ChromePicker
              color={props.attributes.bgColor}
              onChangeComplete={(x) => props.setAttributes({ bgColor: x.hex })}
              disableAlpha={true}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <TextControl
        label="Question:"
        value={props.attributes.question}
        onChange={updateQuestion}
        style={{ fontSize: '20px' }}
      />
      <p style={{ fontSize: '13px', margin: '20px 0 8px 0' }}>Answers:</p>
      {props.attributes.answers.map((answer, index) => (
        <Flex>
          <FlexBlock>
            <TextControl
              value={answer}
              onChange={(newValue) => {
                updateAnswer(index, newValue);
              }}
            />
          </FlexBlock>
          <FlexItem>
            <Button onClick={() => markAsCorrect(index)}>
              <Icon
                className="mark-as-correct"
                icon={
                  props.attributes.correctAnswer == index
                    ? 'star-filled'
                    : 'star-empty'
                }
              />
            </Button>
          </FlexItem>
          <FlexItem>
            <Button
              variant="link"
              onClick={() => deleteAnswer(index)}
              className="attention-delete"
            >
              Delete
            </Button>
          </FlexItem>
        </Flex>
      ))}
      <Button
        onClick={() => {
          props.setAttributes({ answers: [...props.attributes.answers, ''] });
        }}
        variant="primary"
      >
        Add another answer
      </Button>
    </div>
  );
}
