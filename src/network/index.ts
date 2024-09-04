import service from './service'
import { PageState } from '@/store/pageReducer'
import { ComponentType } from '@/store/component/componentReducer'

export type Res = {
  [key: string]: any
}

export type ErrorCode = number | undefined

/** 用户模块 */
export async function getUser(): Promise<Res> {
  const res = await service.get('/user')

  return res
}

export async function userRegister(option: { username: string; password: string }): Promise<Res> {
  const res = await service.post('/register', option)

  return res
}

export async function userLogin(option: { username: string; password: string }): Promise<Res> {
  const res = await service.post('/login', option)

  return res
}

/** 问卷管理模块  */
type SurveyQuery = {
  keyword: string
  isPublish: boolean
  isStar: boolean
  isDelete: boolean
  pageNum: number
  pageSize: number
}

export async function getSurveyListData(query: Partial<SurveyQuery> = {}): Promise<Res> {
  const res = await service.get('/survey', { params: query })

  return res
}

export async function createNewSurvey(): Promise<Res> {
  const res = await service.post('/survey')

  return res
}

export async function getSurveyDetailData(id: string): Promise<Res> {
  const res = await service.get(`/survey/${id}`)

  return res
}

export async function updateSurveyData(id: string, query: Partial<SurveyQuery> = {}): Promise<Res> {
  const res = await service.patch(`/survey/update/${id}`, query)

  return res
}

export async function duplicateSurveyData(id: string): Promise<Res> {
  const res = await service.post(`/survey/duplicate/${id}`)

  return res
}

export async function deleteSurveyData(id: string): Promise<Res> {
  const res = await service.delete(`/survey/delete/${id}`)

  return res
}

export async function saveSurveyData(
  id: string,
  type: 'save' | 'publish' | 'autosave',
  componentList: ComponentType[],
  pageInfo: PageState
): Promise<Res> {
  const res = await service.post(`/survey/save/${id}`, {
    type: type === 'publish' ? type : 'save',
    componentList: componentList,
    pageInfo: pageInfo,
  })

  return res
}
