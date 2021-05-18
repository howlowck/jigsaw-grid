import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'
import {spline} from './spline'

const canvasSize: [number,number] = [800, 600]

var draw = SVG().addTo('#svg-container').size(canvasSize[0], canvasSize[1])

type GroveConfig = {
  startingPoint: [number, number]
  direction: 'v' | 'h',
  totalSegments: number,
  length: number,
  width: number,
  knobRandom: boolean
}

enum PointType {
  boundary,
  shoulder,
  base,
  curve,
  peak
}

type Point = {
  type: PointType,
  segmentIndex: number,
  coord: [number, number]
}

const getRangeRandom = (min, max) => Math.random() * (max - min) + min

const makePointSegment: () => Point[] = () => [
  {type: PointType.shoulder, segmentIndex: null, coord: [null, null]},
  {type: PointType.base,     segmentIndex: null, coord: [null, null]},
  {type: PointType.curve,    segmentIndex: null, coord: [null, null]},
  {type: PointType.peak,     segmentIndex: null, coord: [null, null]},
  {type: PointType.curve,    segmentIndex: null, coord: [null, null]},
  {type: PointType.base,     segmentIndex: null, coord: [null, null]},
  {type: PointType.shoulder, segmentIndex: null, coord: [null, null]},
  {type: PointType.boundary, segmentIndex: null, coord: [null, null]}
]

const generatePoints: (config: GroveConfig) => Point[] 
  = ({startingPoint, direction, totalSegments, length, width, knobRandom}) => {
    const lengthPerPiece = length / totalSegments
    console.log(direction, lengthPerPiece)
    const peakHeight = lengthPerPiece / 4
    let pointArray: Point[] = []
    
    pointArray.push({type: PointType.boundary, segmentIndex: 0, coord: startingPoint})
    
    const marginOfRandom = width / 10

    const s1Offset = lengthPerPiece / 4
    const b1Offset = (5 * lengthPerPiece) / 12
    const c1Offset = (4 * lengthPerPiece) / 12
    const peakOffset = lengthPerPiece / 2
    const c2Offset = (8 * lengthPerPiece) / 12
    const b2Offset = (7 * lengthPerPiece) / 12
    const s2Offset = (3 * lengthPerPiece) / 4

    for (let segment = 0; segment < totalSegments; segment++) {
      const baseLength = segment * lengthPerPiece
      const flipOrNot = Math.random() < 0.5 ? -1 : 1
      const primeDim = [
        baseLength + s1Offset,
        baseLength + b1Offset,
        baseLength + c1Offset,
        baseLength + peakOffset,
        baseLength + c2Offset,
        baseLength + b2Offset,
        baseLength + s2Offset,
        baseLength + lengthPerPiece
      ]
      const startingIndex = direction === 'h' ? 1 : 0
      const secondDim = [
        startingPoint[startingIndex] + getRangeRandom(-1 * marginOfRandom, marginOfRandom),
        startingPoint[startingIndex],
        startingPoint[startingIndex] + (peakHeight * 2 / 3) * flipOrNot,
        startingPoint[startingIndex] + (peakHeight + getRangeRandom(-1 * marginOfRandom/2, marginOfRandom/2)) * flipOrNot,
        startingPoint[startingIndex] + (peakHeight * 2 / 3) * flipOrNot,
        startingPoint[startingIndex],
        startingPoint[startingIndex] + getRangeRandom(-1 * marginOfRandom, marginOfRandom),
        startingPoint[startingIndex]
      ]

      const pointTemplate = makePointSegment()
      pointTemplate.forEach((_, i) => {
        if (direction === 'h') {
          _.coord = [primeDim[i], secondDim[i]]
        } else {
          _.coord = [secondDim[i], primeDim[i]]
        }
        
        pointArray.push(_)
      })
    }

    return pointArray
  }

  
  

// const line2 = generatePoints({direction: 'v', knobRandom: true, length: 600, totalSegments: 10, startingPoint: [60, 0], width: 40})
// const rawPoints2 = line2.map(_ => _.coord)
// const path2 = spline(rawPoints2,1, false, (_) => {})
// draw.path(path2).stroke('red').fill('none')

for (let index = 1; index < 10; index++) {
  const hLine = generatePoints({direction: 'h', knobRandom: true, length: 720, totalSegments: 12, startingPoint: [0, index * 60], width: 40})
  const hRaw = hLine.map(_ => _.coord)
  const hLinePath = spline(hRaw,1, false, (_) => {})
  draw.path(hLinePath).stroke('red').fill('none')
}

for (let index = 1; index < 12; index++) {
  const vLine = generatePoints({direction: 'v', knobRandom: true, length: 600, totalSegments: 10, startingPoint: [index * 60, 0], width: 40})
  const vRaw = vLine.map(_ => _.coord)
  const vLinePath = spline(vRaw,1, false, (_) => {})
  draw.path(vLinePath).stroke('red').fill('none')
}

draw.rect(720, 600).fill('none').stroke('red')