import { useForm } from "@tanstack/react-form"
import { UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { FileUploadInput } from "@/pages/file-upload/file-upload-input"
import {
  fileUploadSchema,
  type FileUploadValues,
  MAX_FILE_COUNT,
  selectedFilesSchema,
} from "@/pages/file-upload/file-upload-schema"

const defaultValues: FileUploadValues = {
  files: [],
}

export function FileUploadForm() {
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: fileUploadSchema,
    },
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Subir archivos</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          id="file-upload-form"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="files"
              mode="array"
              validators={{ onChange: selectedFilesSchema }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Archivos</FieldLabel>
                    <FieldDescription>
                      Puedes agregar hasta {MAX_FILE_COUNT} archivos. La
                      selección duplicada se conserva una sola vez.
                    </FieldDescription>
                    <FileUploadInput
                      id={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-end border-t">
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button form="file-upload-form" type="submit" disabled={!canSubmit}>
              <UploadIcon data-icon="inline-start" />
              Continuar
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}
