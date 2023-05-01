require('dotenv').config();
const axios = require('axios');
const contractutils = require('../utils/contract.utils');

const apiEndPoint = process.env.API_ENDPOINT;

const callAPI = async (endpoint, data) => {
  console.log('sending', data);
  try {
    await axios({
      method: 'post',
      url: apiEndPoint + endpoint,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

const feedbackRTracker = async () => {
  console.log('tracking feedback registrations');
  try {
    let sc = contractutils.loadContract();
    sc.on('FeedbackRegistered', async (feedbackID) => {
      console.log('FeedbackRegistered', feedbackID);
      try {
        // wait 5 seconds to make sure the transaction is mined
        await new Promise((resolve) => setTimeout(resolve, 5000));
        callAPI('feedbackRegistered', { feedbackID });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const feedbackETracker = async () => {
  console.log('tracking feedback evaluations');
  try {
    let sc = contractutils.loadContract();
    sc.on(
      'FeedbackEvaluated',
      async (
        feedbackID,
        juror,
        originality,
        usefulness,
        execution,
        alreadyEvaluated
      ) => {
        console.log('FeedbackEvaluated', feedbackID);
        try {
          // wait 5 seconds to make sure the transaction is mined
          await new Promise((resolve) => setTimeout(resolve, 5000));
          originality = originality.toNumber();
          usefulness = usefulness.toNumber();
          execution = execution.toNumber();
          alreadyEvaluated = alreadyEvaluated.toNumber();
          callAPI('feedbackEvaluated', {
            feedbackID,
            juror,
            originality,
            usefulness,
            execution,
            alreadyEvaluated,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const trackFeedbackActions = async () => {
  try {
    feedbackRTracker();
    feedbackETracker();
  } catch (error) {
    console.log(error);
  }
};

module.exports = trackFeedbackActions;
