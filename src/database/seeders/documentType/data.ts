import { DocumentType, DefaultDocumentType } from '../../../models/documentType'

export const citizenshipCardDocumentType = new DocumentType({ id: DefaultDocumentType.CitizenshipCard, name: 'Citizenship card' })

export const passportDocumentType = new DocumentType({ id: DefaultDocumentType.Passport, name: 'Passport' })

export const documentTypes: DocumentType[] = [
  citizenshipCardDocumentType,
  passportDocumentType
]

export default async function(): Promise<DocumentType[]> {
  return documentTypes
}
