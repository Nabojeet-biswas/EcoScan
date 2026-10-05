import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormFieldContextValue = {
  name: FieldPath<FieldValues>
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)
const FormItemContext = React.createContext<string | null>(null)

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={id}>
      <div
        data-slot="form-item"
        className={cn("space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemId = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext || !itemId) {
    throw new Error("FormField components must be used inside FormField and FormItem")
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const descriptionId = `${itemId}-description`

  return {
    ...fieldState,
    itemId,
    descriptionId,
    messageId: `${itemId}-message`,
  }
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { itemId, error } = useFormField()

  return (
    <Label
      data-slot="form-label"
      htmlFor={itemId}
      className={cn(error && "text-red-primary", className)}
      {...props}
    />
  )
}

type FormControlProps = {
  id?: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean
}

function FormControl({
  children,
}: {
  children: React.ReactElement<FormControlProps>
}) {
  const { itemId, descriptionId, messageId, error } = useFormField()

  return React.cloneElement(children, {
    id: itemId,
    "aria-describedby": error ? `${descriptionId} ${messageId}` : descriptionId,
    "aria-invalid": Boolean(error),
  })
}

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={descriptionId}
      className={cn("text-sm text-fg-muted", className)}
      {...props}
    />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, messageId } = useFormField()
  const body = error ? String(error.message ?? "") : children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={messageId}
      role="alert"
      className={cn("text-sm font-medium text-red-primary", className)}
      {...props}
    >
      {body}
    </p>
  )
}

const Form = FormProvider

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
