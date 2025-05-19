import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@phosphor-icons/react";
import { useLinkForm } from "./use-link-form";

export function LinkForm() {
  const { form, handleSubmit, isPending } = useLinkForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Novo link</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              defaultValue=""
              name="original"
              render={({ field }) => (
                <FormItem className="group flex flex-col-reverse">
                  <FormMessage />
                  <FormControl>
                    <Input
                      placeholder="http://www.exemplo.com.br"
                      {...field}
                      className="peer hover:border-primary placeholder:text-secondary-foreground transition-all placeholder:"
                      disabled={isPending}
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormLabel className="peer-focus:font-semibold peer-focus:text-primary peer-hover:text-primary transition-all">
                    Link original
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue=""
              name="shortened"
              render={({ field }) => (
                <FormItem className="group relative flex flex-col-reverse">
                  <span className="top-8 left-3 absolute text-secondary-foreground select-none">
                    brev.ly/
                  </span>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      className="peer pl-16.5 hover:border-primary placeholder:text-secondary-foreground transition-all"
                      disabled={isPending}
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormLabel className="peer-focus:font-semibold peer-focus:text-primary peer-hover:text-primary transition-all">
                    Link encurtado
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="animate-spin" />
                  Salvando
                </span>
              ) : (
                "Salvar link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
