import { Instance, types } from "mobx-state-tree"
import { Point } from "../../../data-display/data-display-types"
import { AdornmentModel, IAdornmentModel, IUpdateCategoriesOptions, PointModel } from "../adornment-models"
import { IAxisModel, isNumericAxisModel } from "../../../axis/models/axis-model"
import { kMovablePointType } from "./movable-point-adornment-types"


export const MovablePointAdornmentModel = AdornmentModel
  .named("MovablePointAdornmentModel")
  .props({
    type: types.optional(types.literal(kMovablePointType), kMovablePointType),
    points: types.map(PointModel)
  })
  .views(self => ({
    getInitialPosition(axis?: IAxisModel) {
      if (!isNumericAxisModel(axis)) return 0
      const [min, max] = axis.domain
      return max - (max - min) / 4
    }
  }))
  .actions(self => ({
    setPoint(aPoint: Point, key="") {
      self.points.set(key, aPoint)
    }
  }))
  .actions(self => ({
    setInitialPoint(xAxis?: IAxisModel, yAxis?: IAxisModel, key="") {
      self.setPoint({ x: self.getInitialPosition(xAxis), y: self.getInitialPosition(yAxis) }, key)
    }
  }))
  .actions(self => ({
    updateCategories(options: IUpdateCategoriesOptions) {
      const { resetPoints, xAxis, yAxis } = options
      self.getAllCellKeys(options).forEach(cellKey => {
        const instanceKey = self.instanceKey(cellKey)
        if (!self.points.get(instanceKey) || resetPoints) {
          self.setInitialPoint(xAxis, yAxis, instanceKey)
        }
      })
    }
  }))
export interface IMovablePointAdornmentModel extends Instance<typeof MovablePointAdornmentModel> {}
export function isMovablePointAdornment(adornment: IAdornmentModel): adornment is IMovablePointAdornmentModel {
  return adornment.type === kMovablePointType
}
