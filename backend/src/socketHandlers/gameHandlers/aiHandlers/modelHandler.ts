import * as tf from '@tensorflow/tfjs-node'
import path from 'path'

export async function loadModel(name: string) {
  return await tf.loadGraphModel(`file://${path.join(__dirname, 'models', name, 'model.json')}`)
}

export async function predictAction(model: tf.GraphModel, state: number[], actions: number[][]) {
  const inputData = actions.map((action) => {
    return [...state, ...action]
  })
  const prediction = model.predict(tf.tensor2d(inputData)) as tf.Tensor
  const predictionData = prediction.dataSync()
  const predictedActionIndex = predictionData.indexOf(Math.max(...predictionData))
  return actions[predictedActionIndex].join('')
}
