export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  datos_campo: {
    Tables: {
      dc_ambiente: {
        Row: {
          atributos: Json
          color: string | null
          created_at: string | null
          estado: string | null
          geometry: Json
          has: number
          id: string
          id_establecimiento: string
          lote_id: string | null
          nombre: string
        }
        Insert: {
          atributos?: Json
          color?: string | null
          created_at?: string | null
          estado?: string | null
          geometry: Json
          has: number
          id?: string
          id_establecimiento: string
          lote_id?: string | null
          nombre: string
        }
        Update: {
          atributos?: Json
          color?: string | null
          created_at?: string | null
          estado?: string | null
          geometry?: Json
          has?: number
          id?: string
          id_establecimiento?: string
          lote_id?: string | null
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "dc_ambiente_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "dc_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_ambiente_lote: {
        Row: {
          ambiente_id: string
          color: string | null
          created_at: string | null
          geometry: Json
          has: number
          id: string
          id_establecimiento: string
          lote_id: string
          nombre_ambiente: string
          nombre_lote: string
          porcentaje_lote: number
        }
        Insert: {
          ambiente_id: string
          color?: string | null
          created_at?: string | null
          geometry: Json
          has: number
          id?: string
          id_establecimiento: string
          lote_id: string
          nombre_ambiente: string
          nombre_lote: string
          porcentaje_lote: number
        }
        Update: {
          ambiente_id?: string
          color?: string | null
          created_at?: string | null
          geometry?: Json
          has?: number
          id?: string
          id_establecimiento?: string
          lote_id?: string
          nombre_ambiente?: string
          nombre_lote?: string
          porcentaje_lote?: number
        }
        Relationships: [
          {
            foreignKeyName: "dc_ambiente_lote_ambiente_id_fkey"
            columns: ["ambiente_id"]
            isOneToOne: false
            referencedRelation: "dc_ambiente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dc_ambiente_lote_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "dc_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_capa_gis: {
        Row: {
          campo_esquema: Json
          created_at: string | null
          geojson: Json
          id: string
          id_establecimiento: string
          metadata: Json | null
          nombre: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          campo_esquema?: Json
          created_at?: string | null
          geojson: Json
          id?: string
          id_establecimiento: string
          metadata?: Json | null
          nombre: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          campo_esquema?: Json
          created_at?: string | null
          geojson?: Json
          id?: string
          id_establecimiento?: string
          metadata?: Json | null
          nombre?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dc_foto: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          storage_path: string | null
          tarea_id: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          storage_path?: string | null
          tarea_id?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          storage_path?: string | null
          tarea_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dc_foto_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "dc_tarea"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_lote: {
        Row: {
          atributos: Json
          capa_gis_id: string | null
          color: string | null
          created_at: string | null
          estado: string | null
          geometry: Json
          has: number | null
          id: string
          id_establecimiento: string
          nombre_lote: string
          reemplazado_por: string | null
        }
        Insert: {
          atributos?: Json
          capa_gis_id?: string | null
          color?: string | null
          created_at?: string | null
          estado?: string | null
          geometry: Json
          has?: number | null
          id?: string
          id_establecimiento: string
          nombre_lote: string
          reemplazado_por?: string | null
        }
        Update: {
          atributos?: Json
          capa_gis_id?: string | null
          color?: string | null
          created_at?: string | null
          estado?: string | null
          geometry?: Json
          has?: number | null
          id?: string
          id_establecimiento?: string
          nombre_lote?: string
          reemplazado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dc_lote_capa_gis_id_fkey"
            columns: ["capa_gis_id"]
            isOneToOne: false
            referencedRelation: "dc_capa_gis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dc_lote_reemplazado_por_fkey"
            columns: ["reemplazado_por"]
            isOneToOne: false
            referencedRelation: "dc_lote"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_recorrida: {
        Row: {
          capa_gis_id: string | null
          created_at: string | null
          educador_id: number | null
          estado: string | null
          fecha: string
          id: string
          id_establecimiento: string
          id_servicio: string | null
          nombre: string | null
          observaciones_generales: string | null
          origen: string | null
          updated_at: string | null
        }
        Insert: {
          capa_gis_id?: string | null
          created_at?: string | null
          educador_id?: number | null
          estado?: string | null
          fecha: string
          id?: string
          id_establecimiento: string
          id_servicio?: string | null
          nombre?: string | null
          observaciones_generales?: string | null
          origen?: string | null
          updated_at?: string | null
        }
        Update: {
          capa_gis_id?: string | null
          created_at?: string | null
          educador_id?: number | null
          estado?: string | null
          fecha?: string
          id?: string
          id_establecimiento?: string
          id_servicio?: string | null
          nombre?: string | null
          observaciones_generales?: string | null
          origen?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dc_recorrida_capa_gis_id_fkey"
            columns: ["capa_gis_id"]
            isOneToOne: false
            referencedRelation: "dc_capa_gis"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_subtarea: {
        Row: {
          created_at: string | null
          datos: Json | null
          gps_accuracy: number | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          tarea_id: string
        }
        Insert: {
          created_at?: string | null
          datos?: Json | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          tarea_id: string
        }
        Update: {
          created_at?: string | null
          datos?: Json | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          tarea_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dc_subtarea_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "dc_tarea"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_tarea: {
        Row: {
          ambiente_id: string | null
          created_at: string | null
          datos: Json | null
          estado: string | null
          form_version: number | null
          gps_accuracy: number | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          id_establecimiento: string
          lote_id: string | null
          orden: number | null
          origen: string | null
          recorrida_id: string
          tags: Json | null
          tarea_tipo_id: string
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          ambiente_id?: string | null
          created_at?: string | null
          datos?: Json | null
          estado?: string | null
          form_version?: number | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          id_establecimiento: string
          lote_id?: string | null
          orden?: number | null
          origen?: string | null
          recorrida_id: string
          tags?: Json | null
          tarea_tipo_id: string
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          ambiente_id?: string | null
          created_at?: string | null
          datos?: Json | null
          estado?: string | null
          form_version?: number | null
          gps_accuracy?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          id_establecimiento?: string
          lote_id?: string | null
          orden?: number | null
          origen?: string | null
          recorrida_id?: string
          tags?: Json | null
          tarea_tipo_id?: string
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dc_tarea_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "dc_lote"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dc_tarea_recorrida_id_fkey"
            columns: ["recorrida_id"]
            isOneToOne: false
            referencedRelation: "dc_recorrida"
            referencedColumns: ["id"]
          },
        ]
      }
      dc_tarea_tipo: {
        Row: {
          campos: Json
          created_at: string | null
          estado: string | null
          id: string
          nivel: string
          nombre: string
          orden: number | null
          subtarea_campos: Json | null
          subtarea_config: Json | null
          updated_at: string | null
          version: number
        }
        Insert: {
          campos: Json
          created_at?: string | null
          estado?: string | null
          id: string
          nivel: string
          nombre: string
          orden?: number | null
          subtarea_campos?: Json | null
          subtarea_config?: Json | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          campos?: Json
          created_at?: string | null
          estado?: string | null
          id?: string
          nivel?: string
          nombre?: string
          orden?: number | null
          subtarea_campos?: Json | null
          subtarea_config?: Json | null
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      dc_tarea_tipo_servicio: {
        Row: {
          auto_generar: boolean | null
          servicio_tipo: string
          tarea_tipo_id: string
          tarea_tipo_version: number
        }
        Insert: {
          auto_generar?: boolean | null
          servicio_tipo: string
          tarea_tipo_id: string
          tarea_tipo_version?: number
        }
        Update: {
          auto_generar?: boolean | null
          servicio_tipo?: string
          tarea_tipo_id?: string
          tarea_tipo_version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      actividades_reftable: {
        Row: {
          actividad: string | null
          id: number
        }
        Insert: {
          actividad?: string | null
          id: number
        }
        Update: {
          actividad?: string | null
          id?: number
        }
        Relationships: []
      }
      afip_configuracion: {
        Row: {
          ambiente: string
          cert_alias: string | null
          cert_auth_tag: string | null
          cert_created_at: string | null
          cert_iv: string | null
          cert_valid_until: string | null
          certificado_encrypted: string | null
          certificado_pem: string | null
          clave_fiscal_encrypted: string | null
          condicion_iva: string | null
          created_at: string | null
          cuit: number
          cuit_representante: number | null
          domicilio_fiscal: string | null
          id: string
          id_educador: number | null
          ingresos_brutos: string | null
          inicio_actividades: string | null
          key_auth_tag: string | null
          key_iv: string | null
          private_key_encrypted: string | null
          private_key_pem: string | null
          punto_venta: number
          razon_social: string | null
          servicios_habilitados: string[] | null
          status: string
          status_message: string | null
          ultima_sync_por_servicio: Json | null
          updated_at: string | null
        }
        Insert: {
          ambiente?: string
          cert_alias?: string | null
          cert_auth_tag?: string | null
          cert_created_at?: string | null
          cert_iv?: string | null
          cert_valid_until?: string | null
          certificado_encrypted?: string | null
          certificado_pem?: string | null
          clave_fiscal_encrypted?: string | null
          condicion_iva?: string | null
          created_at?: string | null
          cuit: number
          cuit_representante?: number | null
          domicilio_fiscal?: string | null
          id?: string
          id_educador?: number | null
          ingresos_brutos?: string | null
          inicio_actividades?: string | null
          key_auth_tag?: string | null
          key_iv?: string | null
          private_key_encrypted?: string | null
          private_key_pem?: string | null
          punto_venta?: number
          razon_social?: string | null
          servicios_habilitados?: string[] | null
          status?: string
          status_message?: string | null
          ultima_sync_por_servicio?: Json | null
          updated_at?: string | null
        }
        Update: {
          ambiente?: string
          cert_alias?: string | null
          cert_auth_tag?: string | null
          cert_created_at?: string | null
          cert_iv?: string | null
          cert_valid_until?: string | null
          certificado_encrypted?: string | null
          certificado_pem?: string | null
          clave_fiscal_encrypted?: string | null
          condicion_iva?: string | null
          created_at?: string | null
          cuit?: number
          cuit_representante?: number | null
          domicilio_fiscal?: string | null
          id?: string
          id_educador?: number | null
          ingresos_brutos?: string | null
          inicio_actividades?: string | null
          key_auth_tag?: string | null
          key_iv?: string | null
          private_key_encrypted?: string | null
          private_key_pem?: string | null
          punto_venta?: number
          razon_social?: string | null
          servicios_habilitados?: string[] | null
          status?: string
          status_message?: string | null
          ultima_sync_por_servicio?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afip_configuracion_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      afip_operaciones_log: {
        Row: {
          created_at: string | null
          created_by: string | null
          duracion_ms: number | null
          error_code: string | null
          error_message: string | null
          factura_id: number | null
          id: string
          operacion: string
          request_payload: Json | null
          response_payload: Json | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          duracion_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          factura_id?: number | null
          id?: string
          operacion: string
          request_payload?: Json | null
          response_payload?: Json | null
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          duracion_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          factura_id?: number | null
          id?: string
          operacion?: string
          request_payload?: Json | null
          response_payload?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "afip_operaciones_log_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afip_operaciones_log_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
        ]
      }
      agenda: {
        Row: {
          cotizacion_unidad: number | null
          created_at: string | null
          created_by: number | null
          descuento_porcentaje: number | null
          dias_campo: number | null
          dias_gabinete: number | null
          educadores: number[] | null
          estado_establecimiento: Database["public"]["Enums"]["Estado"] | null
          estado_presupuesto: number | null
          estado_trabajo: number | null
          fecha: string | null
          fecha_envio_informe: string | null
          fecha_fin_servicio: string | null
          fecha_sugerida: string | null
          gfotos_album_url: string | null
          gfotos_created_at: string | null
          gfotos_error: string | null
          gfotos_id: string | null
          gfotos_oauth_user_email: string | null
          gfotos_shareable_url: string | null
          google_calendar_event_id: string | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          honorarios_efectivos_pagados: number | null
          honorarios_servicio: number | null
          id_establecimiento: string | null
          id_linea_presupuesto: string | null
          id_presupuesto_nuevo: string | null
          id_servicio: string
          id_tipo_servicio: number | null
          informe_1_comentario: string | null
          informe_1_email_enviado_a: string[] | null
          informe_1_enviado_at: string | null
          informe_1_id_tipo: number | null
          informe_1_link: string | null
          informe_2_comentario: string | null
          informe_2_email_enviado_a: string[] | null
          informe_2_enviado_at: string | null
          informe_2_id_tipo: number | null
          informe_2_link: string | null
          informes_requeridos: number | null
          isdeleted: boolean
          kms_presupuestados: number | null
          last_edited: string | null
          last_edited_by: string | null
          last_edited_calendar: string | null
          link_informe_drive: string | null
          localidad: string | null
          monto_movilidad: number | null
          nombre_establecimiento: string | null
          numero_visita: number | null
          observacion: string | null
          precio_unitario: number | null
          servicio: string | null
          subtotal: number | null
          tipo_unidad:
            | Database["public"]["Enums"]["Unidades de Facturacion"]
            | null
          total_honorarios: number | null
          total_servicio: number | null
        }
        Insert: {
          cotizacion_unidad?: number | null
          created_at?: string | null
          created_by?: number | null
          descuento_porcentaje?: number | null
          dias_campo?: number | null
          dias_gabinete?: number | null
          educadores?: number[] | null
          estado_establecimiento?: Database["public"]["Enums"]["Estado"] | null
          estado_presupuesto?: number | null
          estado_trabajo?: number | null
          fecha?: string | null
          fecha_envio_informe?: string | null
          fecha_fin_servicio?: string | null
          fecha_sugerida?: string | null
          gfotos_album_url?: string | null
          gfotos_created_at?: string | null
          gfotos_error?: string | null
          gfotos_id?: string | null
          gfotos_oauth_user_email?: string | null
          gfotos_shareable_url?: string | null
          google_calendar_event_id?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          honorarios_efectivos_pagados?: number | null
          honorarios_servicio?: number | null
          id_establecimiento?: string | null
          id_linea_presupuesto?: string | null
          id_presupuesto_nuevo?: string | null
          id_servicio: string
          id_tipo_servicio?: number | null
          informe_1_comentario?: string | null
          informe_1_email_enviado_a?: string[] | null
          informe_1_enviado_at?: string | null
          informe_1_id_tipo?: number | null
          informe_1_link?: string | null
          informe_2_comentario?: string | null
          informe_2_email_enviado_a?: string[] | null
          informe_2_enviado_at?: string | null
          informe_2_id_tipo?: number | null
          informe_2_link?: string | null
          informes_requeridos?: number | null
          isdeleted?: boolean
          kms_presupuestados?: number | null
          last_edited?: string | null
          last_edited_by?: string | null
          last_edited_calendar?: string | null
          link_informe_drive?: string | null
          localidad?: string | null
          monto_movilidad?: number | null
          nombre_establecimiento?: string | null
          numero_visita?: number | null
          observacion?: string | null
          precio_unitario?: number | null
          servicio?: string | null
          subtotal?: number | null
          tipo_unidad?:
            | Database["public"]["Enums"]["Unidades de Facturacion"]
            | null
          total_honorarios?: number | null
          total_servicio?: number | null
        }
        Update: {
          cotizacion_unidad?: number | null
          created_at?: string | null
          created_by?: number | null
          descuento_porcentaje?: number | null
          dias_campo?: number | null
          dias_gabinete?: number | null
          educadores?: number[] | null
          estado_establecimiento?: Database["public"]["Enums"]["Estado"] | null
          estado_presupuesto?: number | null
          estado_trabajo?: number | null
          fecha?: string | null
          fecha_envio_informe?: string | null
          fecha_fin_servicio?: string | null
          fecha_sugerida?: string | null
          gfotos_album_url?: string | null
          gfotos_created_at?: string | null
          gfotos_error?: string | null
          gfotos_id?: string | null
          gfotos_oauth_user_email?: string | null
          gfotos_shareable_url?: string | null
          google_calendar_event_id?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          honorarios_efectivos_pagados?: number | null
          honorarios_servicio?: number | null
          id_establecimiento?: string | null
          id_linea_presupuesto?: string | null
          id_presupuesto_nuevo?: string | null
          id_servicio?: string
          id_tipo_servicio?: number | null
          informe_1_comentario?: string | null
          informe_1_email_enviado_a?: string[] | null
          informe_1_enviado_at?: string | null
          informe_1_id_tipo?: number | null
          informe_1_link?: string | null
          informe_2_comentario?: string | null
          informe_2_email_enviado_a?: string[] | null
          informe_2_enviado_at?: string | null
          informe_2_id_tipo?: number | null
          informe_2_link?: string | null
          informes_requeridos?: number | null
          isdeleted?: boolean
          kms_presupuestados?: number | null
          last_edited?: string | null
          last_edited_by?: string | null
          last_edited_calendar?: string | null
          link_informe_drive?: string | null
          localidad?: string | null
          monto_movilidad?: number | null
          nombre_establecimiento?: string | null
          numero_visita?: number | null
          observacion?: string | null
          precio_unitario?: number | null
          servicio?: string | null
          subtotal?: number | null
          tipo_unidad?:
            | Database["public"]["Enums"]["Unidades de Facturacion"]
            | null
          total_honorarios?: number | null
          total_servicio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "linea_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_linea"]
          },
          {
            foreignKeyName: "agenda_id_presupuesto_nuevo_fkey"
            columns: ["id_presupuesto_nuevo"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_id_presupuesto_nuevo_fkey"
            columns: ["id_presupuesto_nuevo"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "agenda_id_presupuesto_nuevo_fkey"
            columns: ["id_presupuesto_nuevo"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "agenda_id_presupuesto_nuevo_fkey"
            columns: ["id_presupuesto_nuevo"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_id_presupuesto_nuevo_fkey"
            columns: ["id_presupuesto_nuevo"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "agenda_id_tipo_servicio_fkey"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipodeservicio_reftable"
            referencedColumns: ["id"]
          },
        ]
      }
      categoria_reembolsable: {
        Row: {
          categoria: string
          es_reembolsable: boolean
        }
        Insert: {
          categoria: string
          es_reembolsable: boolean
        }
        Update: {
          categoria?: string
          es_reembolsable?: boolean
        }
        Relationships: []
      }
      configuracion_general: {
        Row: {
          clave: string
          descripcion: string | null
          updated_at: string | null
          updated_by: number | null
          valor: Json
        }
        Insert: {
          clave: string
          descripcion?: string | null
          updated_at?: string | null
          updated_by?: number | null
          valor: Json
        }
        Update: {
          clave?: string
          descripcion?: string | null
          updated_at?: string | null
          updated_by?: number | null
          valor?: Json
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_general_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      contacto_establecimiento: {
        Row: {
          created_at: string | null
          created_by: string | null
          es_principal: boolean | null
          id: string
          id_contacto: string
          id_establecimiento: string
          notas: string | null
          rol:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          es_principal?: boolean | null
          id?: string
          id_contacto: string
          id_establecimiento: string
          notas?: string | null
          rol?:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          es_principal?: boolean | null
          id?: string
          id_contacto?: string
          id_establecimiento?: string
          notas?: string | null
          rol?:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_establecimiento_id_contacto_fkey"
            columns: ["id_contacto"]
            isOneToOne: false
            referencedRelation: "contactos"
            referencedColumns: ["id_contacto"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_contacto_fkey"
            columns: ["id_contacto"]
            isOneToOne: false
            referencedRelation: "v_contactos_con_establecimientos"
            referencedColumns: ["id_contacto"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_contacto_fkey"
            columns: ["id_contacto"]
            isOneToOne: false
            referencedRelation: "v_contactos_establecimientos"
            referencedColumns: ["id_contacto"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      contactos: {
        Row: {
          apellido: string | null
          canal_preferido:
            | Database["public"]["Enums"]["canal_preferido_contacto"]
            | null
          created_at: string | null
          created_by: string | null
          id_contacto: string
          last_edited: string | null
          last_edited_by: string | null
          mail: string | null
          nombre: string | null
          nombre_completo: string | null
          rol_establecimiento:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
          telefono: string | null
        }
        Insert: {
          apellido?: string | null
          canal_preferido?:
            | Database["public"]["Enums"]["canal_preferido_contacto"]
            | null
          created_at?: string | null
          created_by?: string | null
          id_contacto: string
          last_edited?: string | null
          last_edited_by?: string | null
          mail?: string | null
          nombre?: string | null
          nombre_completo?: string | null
          rol_establecimiento?:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
          telefono?: string | null
        }
        Update: {
          apellido?: string | null
          canal_preferido?:
            | Database["public"]["Enums"]["canal_preferido_contacto"]
            | null
          created_at?: string | null
          created_by?: string | null
          id_contacto?: string
          last_edited?: string | null
          last_edited_by?: string | null
          mail?: string | null
          nombre?: string | null
          nombre_completo?: string | null
          rol_establecimiento?:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
          telefono?: string | null
        }
        Relationships: []
      }
      cuenta_corriente_tecnico: {
        Row: {
          created_at: string | null
          cuota_pct: number | null
          descripcion: string | null
          fecha: string | null
          id: number
          id_educador: number | null
          id_honorario: number | null
          id_origen: string | null
          monto: number | null
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          cuota_pct?: number | null
          descripcion?: string | null
          fecha?: string | null
          id?: number
          id_educador?: number | null
          id_honorario?: number | null
          id_origen?: string | null
          monto?: number | null
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          cuota_pct?: number | null
          descripcion?: string | null
          fecha?: string | null
          id?: number
          id_educador?: number | null
          id_honorario?: number | null
          id_origen?: string | null
          monto?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuenta_corriente_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_cuenta_corriente_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_cuenta_corriente_honorario"
            columns: ["id_honorario"]
            isOneToOne: false
            referencedRelation: "honorarios_tecnicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cuenta_corriente_honorario"
            columns: ["id_honorario"]
            isOneToOne: false
            referencedRelation: "v_movilidad_servicios_diagnostico"
            referencedColumns: ["id_honorario_real"]
          },
        ]
      }
      cuota_distribucion_empresa: {
        Row: {
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_cuota"] | null
          fecha_cobrada: string | null
          fecha_facturada: string | null
          id: string
          id_cuota: string
          id_empresa: string
          id_factura: number | null
          monto_pesos_estimado: number | null
          monto_pesos_facturado: number | null
          monto_unidades: number | null
          notas: string | null
          porcentaje: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_cuota"] | null
          fecha_cobrada?: string | null
          fecha_facturada?: string | null
          id?: string
          id_cuota: string
          id_empresa: string
          id_factura?: number | null
          monto_pesos_estimado?: number | null
          monto_pesos_facturado?: number | null
          monto_unidades?: number | null
          notas?: string | null
          porcentaje: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_cuota"] | null
          fecha_cobrada?: string | null
          fecha_facturada?: string | null
          id?: string
          id_cuota?: string
          id_empresa?: string
          id_factura?: number | null
          monto_pesos_estimado?: number | null
          monto_pesos_facturado?: number | null
          monto_unidades?: number | null
          notas?: string | null
          porcentaje?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuota_distribucion_empresa_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_factura_fkey"
            columns: ["id_factura"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_distribucion_empresa_id_factura_fkey"
            columns: ["id_factura"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
        ]
      }
      cuota_presupuesto: {
        Row: {
          costo_km_cuota: number | null
          cotizacion_al_facturar: number | null
          cotizacion_al_presupuestar: number | null
          created_at: string
          cuotas_fusionadas_ids: string[] | null
          estado: Database["public"]["Enums"]["estado_cuota"]
          fecha_cobrada: string | null
          fecha_facturada: string | null
          fecha_programada: string | null
          fusionada_en_cuota_id: string | null
          id: string
          id_factura_perennia: number | null
          id_factura_tecnico: number | null
          id_lineas_asociadas: string[] | null
          id_presupuesto: string
          is_deleted: boolean | null
          kms_cuota: number | null
          monto: number
          monto_honorarios_unidades: number | null
          monto_movilidad_pesos: number | null
          monto_movilidad_unidades: number | null
          monto_pesos_estimado: number | null
          monto_pesos_facturado: number | null
          monto_unidades: number | null
          notas: string | null
          numero_cuota: number
          porcentaje: number
          snapshot_generado_at: string | null
          trigger_cumplido: boolean
          trigger_habilitacion: Json | null
          unidad_monto: string | null
          updated_at: string
        }
        Insert: {
          costo_km_cuota?: number | null
          cotizacion_al_facturar?: number | null
          cotizacion_al_presupuestar?: number | null
          created_at?: string
          cuotas_fusionadas_ids?: string[] | null
          estado?: Database["public"]["Enums"]["estado_cuota"]
          fecha_cobrada?: string | null
          fecha_facturada?: string | null
          fecha_programada?: string | null
          fusionada_en_cuota_id?: string | null
          id?: string
          id_factura_perennia?: number | null
          id_factura_tecnico?: number | null
          id_lineas_asociadas?: string[] | null
          id_presupuesto: string
          is_deleted?: boolean | null
          kms_cuota?: number | null
          monto: number
          monto_honorarios_unidades?: number | null
          monto_movilidad_pesos?: number | null
          monto_movilidad_unidades?: number | null
          monto_pesos_estimado?: number | null
          monto_pesos_facturado?: number | null
          monto_unidades?: number | null
          notas?: string | null
          numero_cuota: number
          porcentaje: number
          snapshot_generado_at?: string | null
          trigger_cumplido?: boolean
          trigger_habilitacion?: Json | null
          unidad_monto?: string | null
          updated_at?: string
        }
        Update: {
          costo_km_cuota?: number | null
          cotizacion_al_facturar?: number | null
          cotizacion_al_presupuestar?: number | null
          created_at?: string
          cuotas_fusionadas_ids?: string[] | null
          estado?: Database["public"]["Enums"]["estado_cuota"]
          fecha_cobrada?: string | null
          fecha_facturada?: string | null
          fecha_programada?: string | null
          fusionada_en_cuota_id?: string | null
          id?: string
          id_factura_perennia?: number | null
          id_factura_tecnico?: number | null
          id_lineas_asociadas?: string[] | null
          id_presupuesto?: string
          is_deleted?: boolean | null
          kms_cuota?: number | null
          monto?: number
          monto_honorarios_unidades?: number | null
          monto_movilidad_pesos?: number | null
          monto_movilidad_unidades?: number | null
          monto_pesos_estimado?: number | null
          monto_pesos_facturado?: number | null
          monto_unidades?: number | null
          notas?: string | null
          numero_cuota?: number
          porcentaje?: number
          snapshot_generado_at?: string | null
          trigger_cumplido?: boolean
          trigger_habilitacion?: Json | null
          unidad_monto?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cuota_presupuesto_fusionada_en_cuota_id_fkey"
            columns: ["fusionada_en_cuota_id"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_fusionada_en_cuota_id_fkey"
            columns: ["fusionada_en_cuota_id"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_factura_perennia_fkey"
            columns: ["id_factura_perennia"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_factura_perennia_fkey"
            columns: ["id_factura_perennia"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "factura_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "v_facturas_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
        ]
      }
      detalle_factura: {
        Row: {
          cantidad: number
          created_at: string
          descripcion: string
          id: string
          id_factura_perennia: number | null
          id_factura_tecnico: number | null
          id_linea_presupuesto: string | null
          id_servicio: string | null
          id_snapshot_linea: string | null
          monto_iva: number
          monto_total: number
          numero_linea: number
          porcentaje_iva: number | null
          precio_unitario: number
          subtotal: number
          tipo_detalle: string | null
          unidad_medida: string
        }
        Insert: {
          cantidad?: number
          created_at?: string
          descripcion: string
          id?: string
          id_factura_perennia?: number | null
          id_factura_tecnico?: number | null
          id_linea_presupuesto?: string | null
          id_servicio?: string | null
          id_snapshot_linea?: string | null
          monto_iva?: number
          monto_total: number
          numero_linea?: number
          porcentaje_iva?: number | null
          precio_unitario: number
          subtotal: number
          tipo_detalle?: string | null
          unidad_medida?: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          descripcion?: string
          id?: string
          id_factura_perennia?: number | null
          id_factura_tecnico?: number | null
          id_linea_presupuesto?: string | null
          id_servicio?: string | null
          id_snapshot_linea?: string | null
          monto_iva?: number
          monto_total?: number
          numero_linea?: number
          porcentaje_iva?: number | null
          precio_unitario?: number
          subtotal?: number
          tipo_detalle?: string | null
          unidad_medida?: string
        }
        Relationships: [
          {
            foreignKeyName: "detalle_factura_id_factura_perennia_fkey"
            columns: ["id_factura_perennia"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_factura_id_factura_perennia_fkey"
            columns: ["id_factura_perennia"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_factura_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "factura_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_factura_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "v_facturas_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_factura_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "linea_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detalle_factura_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_linea"]
          },
          {
            foreignKeyName: "detalle_factura_id_snapshot_linea_fkey"
            columns: ["id_snapshot_linea"]
            isOneToOne: false
            referencedRelation: "snapshot_cuota_lineas"
            referencedColumns: ["id"]
          },
        ]
      }
      educadores: {
        Row: {
          afip_habilitado: boolean | null
          alias: string | null
          auth_user_id: string | null
          avatar_url: string | null
          cbu: string | null
          certificacion_savory: boolean | null
          ciudad: string | null
          condicion_iva: string | null
          contrato: Database["public"]["Enums"]["tipodecontrato"] | null
          cuit: number | null
          cumpleaños: string | null
          dni: number | null
          es_tecnico: boolean
          estado: Database["public"]["Enums"]["estado_tecnico"] | null
          formacion: string | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          id_educador: number
          last_edited: string | null
          mail: string | null
          mail_interno: string | null
          nombre_educador: string | null
          nombrecorto: string | null
          region: string | null
          rol: Database["public"]["Enums"]["rol_educador"]
          seniority: string | null
          seniority_categoria: Database["public"]["Enums"]["seniority"] | null
          telefono: string | null
          tipo_factura_emite: string | null
          ubicacion_coordenadas: string | null
          ubicacion_direccion: string | null
        }
        Insert: {
          afip_habilitado?: boolean | null
          alias?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          cbu?: string | null
          certificacion_savory?: boolean | null
          ciudad?: string | null
          condicion_iva?: string | null
          contrato?: Database["public"]["Enums"]["tipodecontrato"] | null
          cuit?: number | null
          cumpleaños?: string | null
          dni?: number | null
          es_tecnico?: boolean
          estado?: Database["public"]["Enums"]["estado_tecnico"] | null
          formacion?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id_educador: number
          last_edited?: string | null
          mail?: string | null
          mail_interno?: string | null
          nombre_educador?: string | null
          nombrecorto?: string | null
          region?: string | null
          rol?: Database["public"]["Enums"]["rol_educador"]
          seniority?: string | null
          seniority_categoria?: Database["public"]["Enums"]["seniority"] | null
          telefono?: string | null
          tipo_factura_emite?: string | null
          ubicacion_coordenadas?: string | null
          ubicacion_direccion?: string | null
        }
        Update: {
          afip_habilitado?: boolean | null
          alias?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          cbu?: string | null
          certificacion_savory?: boolean | null
          ciudad?: string | null
          condicion_iva?: string | null
          contrato?: Database["public"]["Enums"]["tipodecontrato"] | null
          cuit?: number | null
          cumpleaños?: string | null
          dni?: number | null
          es_tecnico?: boolean
          estado?: Database["public"]["Enums"]["estado_tecnico"] | null
          formacion?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id_educador?: number
          last_edited?: string | null
          mail?: string | null
          mail_interno?: string | null
          nombre_educador?: string | null
          nombrecorto?: string | null
          region?: string | null
          rol?: Database["public"]["Enums"]["rol_educador"]
          seniority?: string | null
          seniority_categoria?: Database["public"]["Enums"]["seniority"] | null
          telefono?: string | null
          tipo_factura_emite?: string | null
          ubicacion_coordenadas?: string | null
          ubicacion_direccion?: string | null
        }
        Relationships: []
      }
      emision_creditos_carbono: {
        Row: {
          cantidad_anios: number | null
          captura_bruta_ha_anio: number | null
          captura_neta_ha_anio: number | null
          created_at: string | null
          creditos_prom_anio: number | null
          creditos_prom_ha_anio: number | null
          creditos_totales: number | null
          descuento_buffer_verra: number | null
          emisiones_ha_anio: number | null
          establecimiento_id: string
          estado: string | null
          farm_id: string | null
          fecha_reporte: string | null
          gdrive_pdf_path: string | null
          has_instancias: number | null
          has_perimetro: number | null
          id: string
          ingreso_estimado_usd: number | null
          periodo_abarcado: string | null
          periodo_monitoreo: string
          porcentaje_productor: number | null
          precio_venta_usd: number | null
          updated_at: string | null
          usd_por_credito_productor: number | null
          vcus_comercializables_ha_anio: number | null
        }
        Insert: {
          cantidad_anios?: number | null
          captura_bruta_ha_anio?: number | null
          captura_neta_ha_anio?: number | null
          created_at?: string | null
          creditos_prom_anio?: number | null
          creditos_prom_ha_anio?: number | null
          creditos_totales?: number | null
          descuento_buffer_verra?: number | null
          emisiones_ha_anio?: number | null
          establecimiento_id: string
          estado?: string | null
          farm_id?: string | null
          fecha_reporte?: string | null
          gdrive_pdf_path?: string | null
          has_instancias?: number | null
          has_perimetro?: number | null
          id?: string
          ingreso_estimado_usd?: number | null
          periodo_abarcado?: string | null
          periodo_monitoreo: string
          porcentaje_productor?: number | null
          precio_venta_usd?: number | null
          updated_at?: string | null
          usd_por_credito_productor?: number | null
          vcus_comercializables_ha_anio?: number | null
        }
        Update: {
          cantidad_anios?: number | null
          captura_bruta_ha_anio?: number | null
          captura_neta_ha_anio?: number | null
          created_at?: string | null
          creditos_prom_anio?: number | null
          creditos_prom_ha_anio?: number | null
          creditos_totales?: number | null
          descuento_buffer_verra?: number | null
          emisiones_ha_anio?: number | null
          establecimiento_id?: string
          estado?: string | null
          farm_id?: string | null
          fecha_reporte?: string | null
          gdrive_pdf_path?: string | null
          has_instancias?: number | null
          has_perimetro?: number | null
          id?: string
          ingreso_estimado_usd?: number | null
          periodo_abarcado?: string | null
          periodo_monitoreo?: string
          porcentaje_productor?: number | null
          precio_venta_usd?: number | null
          updated_at?: string | null
          usd_por_credito_productor?: number | null
          vcus_comercializables_ha_anio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emision_creditos_carbono_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "emision_creditos_carbono_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "emision_creditos_carbono_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "emision_creditos_carbono_establecimiento_id_fkey"
            columns: ["establecimiento_id"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      empresa_establecimiento: {
        Row: {
          created_at: string | null
          created_by: string | null
          es_principal: boolean | null
          id: string
          id_empresa: string
          id_establecimiento: string
          notas: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          es_principal?: boolean | null
          id?: string
          id_empresa: string
          id_establecimiento: string
          notas?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          es_principal?: boolean | null
          id?: string
          id_empresa?: string
          id_establecimiento?: string
          notas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      empresas: {
        Row: {
          actividad_principal: string | null
          condicion_iva_afip: string | null
          cuit: number | null
          domicilio_fiscal: string | null
          estado_cuit: string | null
          id_empresa: string
          id_tecnico_preferido: number | null
          iva: Database["public"]["Enums"]["factura"] | null
          last_edited: string | null
          last_edited_by: string | null
          mes_cierre: number | null
          preferencia_factura: string | null
          razonsocial: string | null
          tipo_factura_preferido: string | null
          tipo_persona: string | null
          ultima_sync_afip: string | null
        }
        Insert: {
          actividad_principal?: string | null
          condicion_iva_afip?: string | null
          cuit?: number | null
          domicilio_fiscal?: string | null
          estado_cuit?: string | null
          id_empresa: string
          id_tecnico_preferido?: number | null
          iva?: Database["public"]["Enums"]["factura"] | null
          last_edited?: string | null
          last_edited_by?: string | null
          mes_cierre?: number | null
          preferencia_factura?: string | null
          razonsocial?: string | null
          tipo_factura_preferido?: string | null
          tipo_persona?: string | null
          ultima_sync_afip?: string | null
        }
        Update: {
          actividad_principal?: string | null
          condicion_iva_afip?: string | null
          cuit?: number | null
          domicilio_fiscal?: string | null
          estado_cuit?: string | null
          id_empresa?: string
          id_tecnico_preferido?: number | null
          iva?: Database["public"]["Enums"]["factura"] | null
          last_edited?: string | null
          last_edited_by?: string | null
          mes_cierre?: number | null
          preferencia_factura?: string | null
          razonsocial?: string | null
          tipo_factura_preferido?: string | null
          tipo_persona?: string | null
          ultima_sync_afip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_id_tecnico_preferido_fkey"
            columns: ["id_tecnico_preferido"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      error_report: {
        Row: {
          action: string | null
          app_version: string | null
          created_at: string
          environment: string
          error_code: string | null
          error_details: string | null
          error_hint: string | null
          error_message: string
          id: number
          page_url: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          app_version?: string | null
          created_at?: string
          environment?: string
          error_code?: string | null
          error_details?: string | null
          error_hint?: string | null
          error_message: string
          id?: never
          page_url: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          app_version?: string | null
          created_at?: string
          environment?: string
          error_code?: string | null
          error_details?: string | null
          error_hint?: string | null
          error_message?: string
          id?: never
          page_url?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      esquema_facturacion: {
        Row: {
          cantidad_periodos: number | null
          created_at: string
          descripcion: string | null
          es_activo: boolean
          id: string
          nombre: string
          periodicidad:
            | Database["public"]["Enums"]["periodicidad_facturacion"]
            | null
          porcentaje_cuotas: number[] | null
          tipo: Database["public"]["Enums"]["tipo_esquema_facturacion"]
          triggers_cuotas: Json | null
          updated_at: string
        }
        Insert: {
          cantidad_periodos?: number | null
          created_at?: string
          descripcion?: string | null
          es_activo?: boolean
          id?: string
          nombre: string
          periodicidad?:
            | Database["public"]["Enums"]["periodicidad_facturacion"]
            | null
          porcentaje_cuotas?: number[] | null
          tipo: Database["public"]["Enums"]["tipo_esquema_facturacion"]
          triggers_cuotas?: Json | null
          updated_at?: string
        }
        Update: {
          cantidad_periodos?: number | null
          created_at?: string
          descripcion?: string | null
          es_activo?: boolean
          id?: string
          nombre?: string
          periodicidad?:
            | Database["public"]["Enums"]["periodicidad_facturacion"]
            | null
          porcentaje_cuotas?: number[] | null
          tipo?: Database["public"]["Enums"]["tipo_esquema_facturacion"]
          triggers_cuotas?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      establecimientos: {
        Row: {
          _sync_origin: string | null
          actividad_actualizada_at: string | null
          actividad_fuente: string | null
          actividad_principal:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          actividades:
            | Database["public"]["Enums"]["actividad_principal"][]
            | null
          area_agricultura: number | null
          area_ganaderia: number | null
          area_grass_verificada: number | null
          area_tambo: number | null
          area_total: number | null
          bloqueada_at: string | null
          bloqueada_by: number | null
          clasificacion_actualizada_at: string | null
          clasificacion_bloqueada: boolean | null
          comentarios_sara: string | null
          coordenada_jet: Json | null
          coordenadas: string | null
          created_at: string | null
          created_by: string | null
          estado: string | null
          estado_comercial_carbono_interno:
            | Database["public"]["Enums"]["estado_comercial_perennia"]
            | null
          etapa_negocio_ruuts: string | null
          ev_ganaderia: number | null
          farm_id: string | null
          fecha_primer_servicio: string | null
          fecha_ultimo_servicio: string | null
          firmante_mrx: Database["public"]["Enums"]["monitoring_report"] | null
          gdrive_created_at: string | null
          gdrive_error: string | null
          gdrive_folder_id: string | null
          gdrive_folder_structure: Json | null
          gdrive_folder_url: string | null
          gdrive_last_synced_at: string | null
          gdrive_shared_with: string[] | null
          gdrive_sync_status: string | null
          grupo: Database["public"]["Enums"]["enum_establecimiento_grupo"]
          id_establecimiento: string
          is_deleted: boolean | null
          last_edited: string | null
          last_edited_by: string | null
          lb_eov: boolean
          localidad: string | null
          nombre_establecimiento: string | null
          nombre_hubspot: string | null
          produccion_tambo_diaria: number | null
          remote_screening_area_elegible: number | null
          remote_screening_desmonte: number | null
          remote_screening_forest: number | null
          remote_screening_native_forest_cat_1: number | null
          remote_screening_native_forest_cat_2: number | null
          remote_screening_native_forest_cat_3: number | null
          remote_screening_total_area: number | null
          remote_screening_wetland: number | null
          subactividad_ganadera:
            | Database["public"]["Enums"]["subactividad_ganadera"]
            | null
          subactividades_ganaderas:
            | Database["public"]["Enums"]["subactividad_ganadera"][]
            | null
          tecnico_responsable: number | null
          tipo_candidato:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_candidato_manual_anterior:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_manejo_actual: string | null
        }
        Insert: {
          _sync_origin?: string | null
          actividad_actualizada_at?: string | null
          actividad_fuente?: string | null
          actividad_principal?:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          actividades?:
            | Database["public"]["Enums"]["actividad_principal"][]
            | null
          area_agricultura?: number | null
          area_ganaderia?: number | null
          area_grass_verificada?: number | null
          area_tambo?: number | null
          area_total?: number | null
          bloqueada_at?: string | null
          bloqueada_by?: number | null
          clasificacion_actualizada_at?: string | null
          clasificacion_bloqueada?: boolean | null
          comentarios_sara?: string | null
          coordenada_jet?: Json | null
          coordenadas?: string | null
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          estado_comercial_carbono_interno?:
            | Database["public"]["Enums"]["estado_comercial_perennia"]
            | null
          etapa_negocio_ruuts?: string | null
          ev_ganaderia?: number | null
          farm_id?: string | null
          fecha_primer_servicio?: string | null
          fecha_ultimo_servicio?: string | null
          firmante_mrx?: Database["public"]["Enums"]["monitoring_report"] | null
          gdrive_created_at?: string | null
          gdrive_error?: string | null
          gdrive_folder_id?: string | null
          gdrive_folder_structure?: Json | null
          gdrive_folder_url?: string | null
          gdrive_last_synced_at?: string | null
          gdrive_shared_with?: string[] | null
          gdrive_sync_status?: string | null
          grupo?: Database["public"]["Enums"]["enum_establecimiento_grupo"]
          id_establecimiento: string
          is_deleted?: boolean | null
          last_edited?: string | null
          last_edited_by?: string | null
          lb_eov: boolean
          localidad?: string | null
          nombre_establecimiento?: string | null
          nombre_hubspot?: string | null
          produccion_tambo_diaria?: number | null
          remote_screening_area_elegible?: number | null
          remote_screening_desmonte?: number | null
          remote_screening_forest?: number | null
          remote_screening_native_forest_cat_1?: number | null
          remote_screening_native_forest_cat_2?: number | null
          remote_screening_native_forest_cat_3?: number | null
          remote_screening_total_area?: number | null
          remote_screening_wetland?: number | null
          subactividad_ganadera?:
            | Database["public"]["Enums"]["subactividad_ganadera"]
            | null
          subactividades_ganaderas?:
            | Database["public"]["Enums"]["subactividad_ganadera"][]
            | null
          tecnico_responsable?: number | null
          tipo_candidato?:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_candidato_manual_anterior?:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_manejo_actual?: string | null
        }
        Update: {
          _sync_origin?: string | null
          actividad_actualizada_at?: string | null
          actividad_fuente?: string | null
          actividad_principal?:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          actividades?:
            | Database["public"]["Enums"]["actividad_principal"][]
            | null
          area_agricultura?: number | null
          area_ganaderia?: number | null
          area_grass_verificada?: number | null
          area_tambo?: number | null
          area_total?: number | null
          bloqueada_at?: string | null
          bloqueada_by?: number | null
          clasificacion_actualizada_at?: string | null
          clasificacion_bloqueada?: boolean | null
          comentarios_sara?: string | null
          coordenada_jet?: Json | null
          coordenadas?: string | null
          created_at?: string | null
          created_by?: string | null
          estado?: string | null
          estado_comercial_carbono_interno?:
            | Database["public"]["Enums"]["estado_comercial_perennia"]
            | null
          etapa_negocio_ruuts?: string | null
          ev_ganaderia?: number | null
          farm_id?: string | null
          fecha_primer_servicio?: string | null
          fecha_ultimo_servicio?: string | null
          firmante_mrx?: Database["public"]["Enums"]["monitoring_report"] | null
          gdrive_created_at?: string | null
          gdrive_error?: string | null
          gdrive_folder_id?: string | null
          gdrive_folder_structure?: Json | null
          gdrive_folder_url?: string | null
          gdrive_last_synced_at?: string | null
          gdrive_shared_with?: string[] | null
          gdrive_sync_status?: string | null
          grupo?: Database["public"]["Enums"]["enum_establecimiento_grupo"]
          id_establecimiento?: string
          is_deleted?: boolean | null
          last_edited?: string | null
          last_edited_by?: string | null
          lb_eov?: boolean
          localidad?: string | null
          nombre_establecimiento?: string | null
          nombre_hubspot?: string | null
          produccion_tambo_diaria?: number | null
          remote_screening_area_elegible?: number | null
          remote_screening_desmonte?: number | null
          remote_screening_forest?: number | null
          remote_screening_native_forest_cat_1?: number | null
          remote_screening_native_forest_cat_2?: number | null
          remote_screening_native_forest_cat_3?: number | null
          remote_screening_total_area?: number | null
          remote_screening_wetland?: number | null
          subactividad_ganadera?:
            | Database["public"]["Enums"]["subactividad_ganadera"]
            | null
          subactividades_ganaderas?:
            | Database["public"]["Enums"]["subactividad_ganadera"][]
            | null
          tecnico_responsable?: number | null
          tipo_candidato?:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_candidato_manual_anterior?:
            | Database["public"]["Enums"]["tipo_candidato_enum"]
            | null
          tipo_manejo_actual?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establecimientos_bloqueada_by_fkey"
            columns: ["bloqueada_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      establecimientos_ruuts: {
        Row: {
          _sync_origin: string | null
          etapa_negocio: string | null
          farm_id: string | null
          id_establecimiento: string
          nombre_hubspot: string | null
          remote_screening_area_elegible: number | null
          remote_screening_desmonte: number | null
          remote_screening_forest: number | null
          remote_screening_native_forest_cat_1: number | null
          remote_screening_native_forest_cat_2: number | null
          remote_screening_native_forest_cat_3: number | null
          remote_screening_total_area: number | null
          remote_screening_wetland: number | null
          reporte_monitoreo_ruuts:
            | Database["public"]["Enums"]["monitoring_report"]
            | null
          tipo_manejo_actual: string | null
        }
        Insert: {
          _sync_origin?: string | null
          etapa_negocio?: string | null
          farm_id?: string | null
          id_establecimiento: string
          nombre_hubspot?: string | null
          remote_screening_area_elegible?: number | null
          remote_screening_desmonte?: number | null
          remote_screening_forest?: number | null
          remote_screening_native_forest_cat_1?: number | null
          remote_screening_native_forest_cat_2?: number | null
          remote_screening_native_forest_cat_3?: number | null
          remote_screening_total_area?: number | null
          remote_screening_wetland?: number | null
          reporte_monitoreo_ruuts?:
            | Database["public"]["Enums"]["monitoring_report"]
            | null
          tipo_manejo_actual?: string | null
        }
        Update: {
          _sync_origin?: string | null
          etapa_negocio?: string | null
          farm_id?: string | null
          id_establecimiento?: string
          nombre_hubspot?: string | null
          remote_screening_area_elegible?: number | null
          remote_screening_desmonte?: number | null
          remote_screening_forest?: number | null
          remote_screening_native_forest_cat_1?: number | null
          remote_screening_native_forest_cat_2?: number | null
          remote_screening_native_forest_cat_3?: number | null
          remote_screening_total_area?: number | null
          remote_screening_wetland?: number | null
          reporte_monitoreo_ruuts?:
            | Database["public"]["Enums"]["monitoring_report"]
            | null
          tipo_manejo_actual?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establecimientos_sara_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: true
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "establecimientos_sara_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: true
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "establecimientos_sara_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: true
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "establecimientos_sara_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: true
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      estadoestablecimiento_reftable: {
        Row: {
          concepto: string | null
          estado_establecimiento: string | null
          id: number
        }
        Insert: {
          concepto?: string | null
          estado_establecimiento?: string | null
          id: number
        }
        Update: {
          concepto?: string | null
          estado_establecimiento?: string | null
          id?: number
        }
        Relationships: []
      }
      estadopresupuesto_reftable: {
        Row: {
          estado_presupuesto: string | null
          id: number
        }
        Insert: {
          estado_presupuesto?: string | null
          id: number
        }
        Update: {
          estado_presupuesto?: string | null
          id?: number
        }
        Relationships: []
      }
      estadotrabajo_reftable: {
        Row: {
          concepto: string | null
          created_at: string
          estado_trabajo: string | null
          id: number
        }
        Insert: {
          concepto?: string | null
          created_at?: string
          estado_trabajo?: string | null
          id?: number
        }
        Update: {
          concepto?: string | null
          created_at?: string
          estado_trabajo?: string | null
          id?: number
        }
        Relationships: []
      }
      evento: {
        Row: {
          asistencia_efectiva: number[] | null
          asistencia_marcada: boolean
          calendario_id: string | null
          cant_asistentes: number | null
          cliente_establecimiento: string | null
          contactos_invitados: string[] | null
          created_at: string
          deleted_at: string | null
          deleted_by: number | null
          descripcion_detallada: string | null
          educadores_internos: number[] | null
          es_dia_completo: boolean | null
          es_reunion_principal: boolean | null
          evento_padre_id: number | null
          fecha_hora_fin: string | null
          fecha_hora_inicio: string | null
          google_calendar_event_id: string | null
          google_meet_url: string | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          id: number
          incluir_google_meet: boolean | null
          is_deleted: boolean | null
          last_edited_calendar: string | null
          localidad: string | null
          minuta: string | null
          nombre: string | null
          presupuesto_movilidad: number | null
          requiere_movilidad: boolean | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Insert: {
          asistencia_efectiva?: number[] | null
          asistencia_marcada?: boolean
          calendario_id?: string | null
          cant_asistentes?: number | null
          cliente_establecimiento?: string | null
          contactos_invitados?: string[] | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: number | null
          descripcion_detallada?: string | null
          educadores_internos?: number[] | null
          es_dia_completo?: boolean | null
          es_reunion_principal?: boolean | null
          evento_padre_id?: number | null
          fecha_hora_fin?: string | null
          fecha_hora_inicio?: string | null
          google_calendar_event_id?: string | null
          google_meet_url?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id?: number
          incluir_google_meet?: boolean | null
          is_deleted?: boolean | null
          last_edited_calendar?: string | null
          localidad?: string | null
          minuta?: string | null
          nombre?: string | null
          presupuesto_movilidad?: number | null
          requiere_movilidad?: boolean | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Update: {
          asistencia_efectiva?: number[] | null
          asistencia_marcada?: boolean
          calendario_id?: string | null
          cant_asistentes?: number | null
          cliente_establecimiento?: string | null
          contactos_invitados?: string[] | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: number | null
          descripcion_detallada?: string | null
          educadores_internos?: number[] | null
          es_dia_completo?: boolean | null
          es_reunion_principal?: boolean | null
          evento_padre_id?: number | null
          fecha_hora_fin?: string | null
          fecha_hora_inicio?: string | null
          google_calendar_event_id?: string | null
          google_meet_url?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id?: number
          incluir_google_meet?: boolean | null
          is_deleted?: boolean | null
          last_edited_calendar?: string | null
          localidad?: string | null
          minuta?: string | null
          nombre?: string | null
          presupuesto_movilidad?: number | null
          requiere_movilidad?: boolean | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Relationships: [
          {
            foreignKeyName: "evento_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "evento_evento_padre_id_fkey"
            columns: ["evento_padre_id"]
            isOneToOne: false
            referencedRelation: "evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_evento_padre_id_fkey"
            columns: ["evento_padre_id"]
            isOneToOne: false
            referencedRelation: "evento_con_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      factura_perennia: {
        Row: {
          afip_response: Json | null
          cae: string | null
          cae_vencimiento: string | null
          descripcion: string | null
          email_enviado_a: string | null
          email_enviado_at: string | null
          emitir_afip: boolean | null
          estado: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha: string | null
          fecha_cobro: string | null
          id: number
          id_cuota: string | null
          id_empresa: string | null
          id_factura_original: number | null
          id_presupuesto: string | null
          id_servicio: string | null
          monto_iva: number | null
          monto_neto: number | null
          monto_nogravado: number | null
          monto_total: number | null
          motivo_nc: string | null
          nro_factura: string | null
          numero_comprobante: number | null
          numero_cuota: number | null
          pdf_storage_path: string | null
          punto_venta: number | null
          tipo_factura: Database["public"]["Enums"]["factura"] | null
        }
        Insert: {
          afip_response?: Json | null
          cae?: string | null
          cae_vencimiento?: string | null
          descripcion?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          emitir_afip?: boolean | null
          estado?: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha?: string | null
          fecha_cobro?: string | null
          id?: number
          id_cuota?: string | null
          id_empresa?: string | null
          id_factura_original?: number | null
          id_presupuesto?: string | null
          id_servicio?: string | null
          monto_iva?: number | null
          monto_neto?: number | null
          monto_nogravado?: number | null
          monto_total?: number | null
          motivo_nc?: string | null
          nro_factura?: string | null
          numero_comprobante?: number | null
          numero_cuota?: number | null
          pdf_storage_path?: string | null
          punto_venta?: number | null
          tipo_factura?: Database["public"]["Enums"]["factura"] | null
        }
        Update: {
          afip_response?: Json | null
          cae?: string | null
          cae_vencimiento?: string | null
          descripcion?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          emitir_afip?: boolean | null
          estado?: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha?: string | null
          fecha_cobro?: string | null
          id?: number
          id_cuota?: string | null
          id_empresa?: string | null
          id_factura_original?: number | null
          id_presupuesto?: string | null
          id_servicio?: string | null
          monto_iva?: number | null
          monto_neto?: number | null
          monto_nogravado?: number | null
          monto_total?: number | null
          motivo_nc?: string | null
          nro_factura?: string | null
          numero_comprobante?: number | null
          numero_cuota?: number | null
          pdf_storage_path?: string | null
          punto_venta?: number | null
          tipo_factura?: Database["public"]["Enums"]["factura"] | null
        }
        Relationships: [
          {
            foreignKeyName: "factura_perennia_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "factura_perennia_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "factura_perennia_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      factura_tecnico: {
        Row: {
          afip_response: Json | null
          archivo_url: string | null
          cae: string | null
          cae_vencimiento: string | null
          comprobante_transferencia_path: string | null
          created_at: string | null
          created_by: number | null
          descripcion: string | null
          email_enviado_a: string | null
          email_enviado_at: string | null
          emitida_via: string | null
          estado: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha: string | null
          fecha_cobro: string | null
          id: number
          id_cuota: string | null
          id_educador: number | null
          id_empresa: string | null
          id_factura_original: number | null
          id_gasto: number | null
          id_presupuesto: string | null
          id_servicio: string | null
          last_edited_at: string | null
          last_edited_by: number | null
          monto_iva: number | null
          monto_neto: number | null
          monto_total: number | null
          motivo_nc: string | null
          nro_factura: string | null
          numero_comprobante: number | null
          numero_cuota: number | null
          pdf_storage_path: string | null
          punto_venta: number | null
          tipo_factura: Database["public"]["Enums"]["factura"] | null
        }
        Insert: {
          afip_response?: Json | null
          archivo_url?: string | null
          cae?: string | null
          cae_vencimiento?: string | null
          comprobante_transferencia_path?: string | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          emitida_via?: string | null
          estado?: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha?: string | null
          fecha_cobro?: string | null
          id?: number
          id_cuota?: string | null
          id_educador?: number | null
          id_empresa?: string | null
          id_factura_original?: number | null
          id_gasto?: number | null
          id_presupuesto?: string | null
          id_servicio?: string | null
          last_edited_at?: string | null
          last_edited_by?: number | null
          monto_iva?: number | null
          monto_neto?: number | null
          monto_total?: number | null
          motivo_nc?: string | null
          nro_factura?: string | null
          numero_comprobante?: number | null
          numero_cuota?: number | null
          pdf_storage_path?: string | null
          punto_venta?: number | null
          tipo_factura?: Database["public"]["Enums"]["factura"] | null
        }
        Update: {
          afip_response?: Json | null
          archivo_url?: string | null
          cae?: string | null
          cae_vencimiento?: string | null
          comprobante_transferencia_path?: string | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          emitida_via?: string | null
          estado?: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          fecha?: string | null
          fecha_cobro?: string | null
          id?: number
          id_cuota?: string | null
          id_educador?: number | null
          id_empresa?: string | null
          id_factura_original?: number | null
          id_gasto?: number | null
          id_presupuesto?: string | null
          id_servicio?: string | null
          last_edited_at?: string | null
          last_edited_by?: number | null
          monto_iva?: number | null
          monto_neto?: number | null
          monto_total?: number | null
          motivo_nc?: string | null
          nro_factura?: string | null
          numero_comprobante?: number | null
          numero_cuota?: number | null
          pdf_storage_path?: string | null
          punto_venta?: number | null
          tipo_factura?: Database["public"]["Enums"]["factura"] | null
        }
        Relationships: [
          {
            foreignKeyName: "factura_tecnico_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "factura_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "factura_tecnico_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "factura_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "v_facturas_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "factura_tecnico_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_tecnico_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_gasto"
            columns: ["id_gasto"]
            isOneToOne: true
            referencedRelation: "gastos_rendidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_factura_gasto"
            columns: ["id_gasto"]
            isOneToOne: true
            referencedRelation: "v_gastos_pendiente_autorizacion"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_rendidos: {
        Row: {
          alicuota_iva: number | null
          cargado_sos: boolean | null
          categoria: string | null
          cbte_tipo_afip: number | null
          centro_costo: string | null
          comprobante_regalado: boolean | null
          comprobante_url: string | null
          created_at: string | null
          created_by: number | null
          cuit_emisor: number | null
          descripcion: string | null
          es_reembolsable: boolean | null
          estado_gasto: Database["public"]["Enums"]["estado_gasto_tecnico"]
          evento: number | null
          excluir_de_liquidacion_fijos: boolean | null
          fecha: string | null
          fiscal_tag: string | null
          id: number
          id_educador: number | null
          id_servicio: string | null
          metodo_pago: Database["public"]["Enums"]["metodo_pago"] | null
          monto: number | null
          monto_exento: number | null
          monto_imp_internos: number | null
          monto_imp_municipales: number | null
          monto_iva: number | null
          monto_neto_gravado: number | null
          monto_neto_no_gravado: number | null
          monto_percepciones_iibb: number | null
          monto_percepciones_iva: number | null
          nro_comprobante_fmt: string | null
          numero_comprobante: number | null
          ocr_confidence: string | null
          ocr_raw_data: Json | null
          origen: Database["public"]["Enums"]["origen_gasto"]
          punto_venta: number | null
          razon_social_emisor: string | null
          tipo_factura: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Insert: {
          alicuota_iva?: number | null
          cargado_sos?: boolean | null
          categoria?: string | null
          cbte_tipo_afip?: number | null
          centro_costo?: string | null
          comprobante_regalado?: boolean | null
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: number | null
          cuit_emisor?: number | null
          descripcion?: string | null
          es_reembolsable?: boolean | null
          estado_gasto?: Database["public"]["Enums"]["estado_gasto_tecnico"]
          evento?: number | null
          excluir_de_liquidacion_fijos?: boolean | null
          fecha?: string | null
          fiscal_tag?: string | null
          id?: number
          id_educador?: number | null
          id_servicio?: string | null
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          monto?: number | null
          monto_exento?: number | null
          monto_imp_internos?: number | null
          monto_imp_municipales?: number | null
          monto_iva?: number | null
          monto_neto_gravado?: number | null
          monto_neto_no_gravado?: number | null
          monto_percepciones_iibb?: number | null
          monto_percepciones_iva?: number | null
          nro_comprobante_fmt?: string | null
          numero_comprobante?: number | null
          ocr_confidence?: string | null
          ocr_raw_data?: Json | null
          origen?: Database["public"]["Enums"]["origen_gasto"]
          punto_venta?: number | null
          razon_social_emisor?: string | null
          tipo_factura?: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Update: {
          alicuota_iva?: number | null
          cargado_sos?: boolean | null
          categoria?: string | null
          cbte_tipo_afip?: number | null
          centro_costo?: string | null
          comprobante_regalado?: boolean | null
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: number | null
          cuit_emisor?: number | null
          descripcion?: string | null
          es_reembolsable?: boolean | null
          estado_gasto?: Database["public"]["Enums"]["estado_gasto_tecnico"]
          evento?: number | null
          excluir_de_liquidacion_fijos?: boolean | null
          fecha?: string | null
          fiscal_tag?: string | null
          id?: number
          id_educador?: number | null
          id_servicio?: string | null
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          monto?: number | null
          monto_exento?: number | null
          monto_imp_internos?: number | null
          monto_imp_municipales?: number | null
          monto_iva?: number | null
          monto_neto_gravado?: number | null
          monto_neto_no_gravado?: number | null
          monto_percepciones_iibb?: number | null
          monto_percepciones_iva?: number | null
          nro_comprobante_fmt?: string | null
          numero_comprobante?: number | null
          ocr_confidence?: string | null
          ocr_raw_data?: Json | null
          origen?: Database["public"]["Enums"]["origen_gasto"]
          punto_venta?: number | null
          razon_social_emisor?: string | null
          tipo_factura?: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gastos_rendidos_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gastos_rendidos_evento_fkey"
            columns: ["evento"]
            isOneToOne: false
            referencedRelation: "evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_rendidos_evento_fkey"
            columns: ["evento"]
            isOneToOne: false
            referencedRelation: "evento_con_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      gfotos_config: {
        Row: {
          created_at: string | null
          google_client_id: string
          google_client_secret: string
          google_refresh_token: string
          id: number
          last_token_refresh: string | null
          perennia_email: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          google_client_id: string
          google_client_secret: string
          google_refresh_token: string
          id?: never
          last_token_refresh?: string | null
          perennia_email: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          google_client_id?: string
          google_client_secret?: string
          google_refresh_token?: string
          id?: never
          last_token_refresh?: string | null
          perennia_email?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      honorario_proyecto: {
        Row: {
          concepto: string | null
          created_at: string | null
          created_by: number | null
          estado: string | null
          id: number
          id_cuenta_corriente: number | null
          id_educador: number
          id_proyecto: string | null
          liquidado_at: string | null
          monto: number
          periodo: string
          porcentaje: number | null
        }
        Insert: {
          concepto?: string | null
          created_at?: string | null
          created_by?: number | null
          estado?: string | null
          id?: number
          id_cuenta_corriente?: number | null
          id_educador: number
          id_proyecto?: string | null
          liquidado_at?: string | null
          monto: number
          periodo: string
          porcentaje?: number | null
        }
        Update: {
          concepto?: string | null
          created_at?: string | null
          created_by?: number | null
          estado?: string | null
          id?: number
          id_cuenta_corriente?: number | null
          id_educador?: number
          id_proyecto?: string | null
          liquidado_at?: string | null
          monto?: number
          periodo?: string
          porcentaje?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "honorario_proyecto_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "honorario_proyecto_id_cuenta_corriente_fkey"
            columns: ["id_cuenta_corriente"]
            isOneToOne: false
            referencedRelation: "cuenta_corriente_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "honorario_proyecto_id_cuenta_corriente_fkey"
            columns: ["id_cuenta_corriente"]
            isOneToOne: false
            referencedRelation: "v_cc_detalle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "honorario_proyecto_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "honorario_proyecto_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
        ]
      }
      honorarios_fijos: {
        Row: {
          created_at: string | null
          created_by: number | null
          estado_liquidacion: string | null
          horas_trabajadas: number | null
          id: string
          id_educador: number
          id_proyecto: string | null
          kgs_novillo: number | null
          last_edited_at: string | null
          observaciones: string | null
          periodo: string
          tipo_honorario: string | null
          total_pesos: number | null
          usd_mep: number | null
          valor_hora: number | null
          valor_inmag: number | null
          valor_mep: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: number | null
          estado_liquidacion?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_educador: number
          id_proyecto?: string | null
          kgs_novillo?: number | null
          last_edited_at?: string | null
          observaciones?: string | null
          periodo: string
          tipo_honorario?: string | null
          total_pesos?: number | null
          usd_mep?: number | null
          valor_hora?: number | null
          valor_inmag?: number | null
          valor_mep?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number | null
          estado_liquidacion?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_educador?: number
          id_proyecto?: string | null
          kgs_novillo?: number | null
          last_edited_at?: string | null
          observaciones?: string | null
          periodo?: string
          tipo_honorario?: string | null
          total_pesos?: number | null
          usd_mep?: number | null
          valor_hora?: number | null
          valor_inmag?: number | null
          valor_mep?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "honorarios_fijos_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "honorarios_fijos_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
        ]
      }
      honorarios_tecnicos: {
        Row: {
          costo_km: number | null
          created_at: string | null
          estado: string | null
          estado_trabajo: number | null
          generado_manual: boolean | null
          habilitado_pct: number | null
          id: number
          id_educador: number | null
          id_movilidad: number | null
          id_servicio: string | null
          kms: number | null
          monto_efectivo: number | null
          monto_teorico: number | null
          movilidad_monto: number | null
          porcentaje: number | null
          servicio_nombre: string | null
        }
        Insert: {
          costo_km?: number | null
          created_at?: string | null
          estado?: string | null
          estado_trabajo?: number | null
          generado_manual?: boolean | null
          habilitado_pct?: number | null
          id?: number
          id_educador?: number | null
          id_movilidad?: number | null
          id_servicio?: string | null
          kms?: number | null
          monto_efectivo?: number | null
          monto_teorico?: number | null
          movilidad_monto?: number | null
          porcentaje?: number | null
          servicio_nombre?: string | null
        }
        Update: {
          costo_km?: number | null
          created_at?: string | null
          estado?: string | null
          estado_trabajo?: number | null
          generado_manual?: boolean | null
          habilitado_pct?: number | null
          id?: number
          id_educador?: number | null
          id_movilidad?: number | null
          id_servicio?: string | null
          kms?: number | null
          monto_efectivo?: number | null
          monto_teorico?: number | null
          movilidad_monto?: number | null
          porcentaje?: number | null
          servicio_nombre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_honorarios_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_honorarios_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_honorarios_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_honorarios_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_honorarios_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "honorario_servicio_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "honorario_servicio_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "honorario_servicio_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "honorario_servicio_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "honorario_servicio_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "honorarios_tecnicos_id_movilidad_fkey"
            columns: ["id_movilidad"]
            isOneToOne: false
            referencedRelation: "movilidad"
            referencedColumns: ["id"]
          },
        ]
      }
      ingreso_proyecto: {
        Row: {
          concepto: string
          created_at: string | null
          created_by: number | null
          estado: string | null
          fecha: string
          id: number
          id_proyecto: string | null
          moneda: string | null
          monto: number
          observaciones: string | null
        }
        Insert: {
          concepto: string
          created_at?: string | null
          created_by?: number | null
          estado?: string | null
          fecha: string
          id?: number
          id_proyecto?: string | null
          moneda?: string | null
          monto: number
          observaciones?: string | null
        }
        Update: {
          concepto?: string
          created_at?: string | null
          created_by?: number | null
          estado?: string | null
          fecha?: string
          id?: number
          id_proyecto?: string | null
          moneda?: string | null
          monto?: number
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingreso_proyecto_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "ingreso_proyecto_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
        ]
      }
      linea_presupuesto: {
        Row: {
          actividad_facturacion: string | null
          cantidad: number | null
          codigo_plantilla: string | null
          costo_km_presupuestado: number | null
          created_at: string
          descripcion: string
          descuento_porcentaje: number | null
          dias_campo_presupuestados: number | null
          dias_gabinete_presupuestados: number | null
          dias_totales_presupuestados: number | null
          educadores: number[] | null
          es_migrado: boolean
          etapa_plan_tierra: string | null
          id: string
          id_presupuesto: string
          id_servicio: string | null
          is_deleted: boolean | null
          kms_estimados_por_visita: number | null
          kms_totales_estimados: number | null
          monto_honorarios: number
          monto_movilidad: number
          monto_otros: number
          monto_total: number | null
          motivo_descuento: string | null
          movilidad_unidades: number | null
          notas: string | null
          orden: number
          origen_estimacion_kms: string | null
          precio_unitario: number | null
          tipo_servicio: string
          unidad_precio: string | null
          updated_at: string
          visitas_estimadas: number | null
        }
        Insert: {
          actividad_facturacion?: string | null
          cantidad?: number | null
          codigo_plantilla?: string | null
          costo_km_presupuestado?: number | null
          created_at?: string
          descripcion?: string
          descuento_porcentaje?: number | null
          dias_campo_presupuestados?: number | null
          dias_gabinete_presupuestados?: number | null
          dias_totales_presupuestados?: number | null
          educadores?: number[] | null
          es_migrado?: boolean
          etapa_plan_tierra?: string | null
          id?: string
          id_presupuesto: string
          id_servicio?: string | null
          is_deleted?: boolean | null
          kms_estimados_por_visita?: number | null
          kms_totales_estimados?: number | null
          monto_honorarios?: number
          monto_movilidad?: number
          monto_otros?: number
          monto_total?: number | null
          motivo_descuento?: string | null
          movilidad_unidades?: number | null
          notas?: string | null
          orden?: number
          origen_estimacion_kms?: string | null
          precio_unitario?: number | null
          tipo_servicio?: string
          unidad_precio?: string | null
          updated_at?: string
          visitas_estimadas?: number | null
        }
        Update: {
          actividad_facturacion?: string | null
          cantidad?: number | null
          codigo_plantilla?: string | null
          costo_km_presupuestado?: number | null
          created_at?: string
          descripcion?: string
          descuento_porcentaje?: number | null
          dias_campo_presupuestados?: number | null
          dias_gabinete_presupuestados?: number | null
          dias_totales_presupuestados?: number | null
          educadores?: number[] | null
          es_migrado?: boolean
          etapa_plan_tierra?: string | null
          id?: string
          id_presupuesto?: string
          id_servicio?: string | null
          is_deleted?: boolean | null
          kms_estimados_por_visita?: number | null
          kms_totales_estimados?: number | null
          monto_honorarios?: number
          monto_movilidad?: number
          monto_otros?: number
          monto_total?: number | null
          motivo_descuento?: string | null
          movilidad_unidades?: number | null
          notas?: string | null
          orden?: number
          origen_estimacion_kms?: string | null
          precio_unitario?: number | null
          tipo_servicio?: string
          unidad_precio?: string | null
          updated_at?: string
          visitas_estimadas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "linea_presupuesto_codigo_plantilla_fkey"
            columns: ["codigo_plantilla"]
            isOneToOne: false
            referencedRelation: "plantilla_servicio"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      mencion: {
        Row: {
          contexto_id: string
          contexto_tipo: string
          created_at: string
          id: string
          id_educador_mencionado: number
          id_notificacion: string | null
          mencionado_por: number
        }
        Insert: {
          contexto_id: string
          contexto_tipo: string
          created_at?: string
          id?: string
          id_educador_mencionado: number
          id_notificacion?: string | null
          mencionado_por: number
        }
        Update: {
          contexto_id?: string
          contexto_tipo?: string
          created_at?: string
          id?: string
          id_educador_mencionado?: number
          id_notificacion?: string | null
          mencionado_por?: number
        }
        Relationships: [
          {
            foreignKeyName: "mencion_id_educador_mencionado_fkey"
            columns: ["id_educador_mencionado"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "mencion_id_notificacion_fkey"
            columns: ["id_notificacion"]
            isOneToOne: false
            referencedRelation: "notificacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mencion_mencionado_por_fkey"
            columns: ["mencionado_por"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      monedas: {
        Row: {
          cer: number | null
          dolar_minorista: number | null
          dolar_referencia_com_3500: number | null
          fecha: string | null
          inmag: number | null
          ipim: number | null
          pkey: number
          siglea: number | null
          uva: number | null
        }
        Insert: {
          cer?: number | null
          dolar_minorista?: number | null
          dolar_referencia_com_3500?: number | null
          fecha?: string | null
          inmag?: number | null
          ipim?: number | null
          pkey: number
          siglea?: number | null
          uva?: number | null
        }
        Update: {
          cer?: number | null
          dolar_minorista?: number | null
          dolar_referencia_com_3500?: number | null
          fecha?: string | null
          inmag?: number | null
          ipim?: number | null
          pkey?: number
          siglea?: number | null
          uva?: number | null
        }
        Relationships: []
      }
      movilidad: {
        Row: {
          approved_at: string | null
          approved_by: number | null
          costo_km: number
          created_at: string | null
          created_by: number | null
          descripcion: string
          destino: string | null
          estado: Database["public"]["Enums"]["estado_movilidad"] | null
          fecha: string
          generado_automaticamente: boolean
          id: number
          id_cuenta_corriente: number | null
          id_educador: number
          id_evento: number | null
          id_honorario_tecnico: number | null
          id_servicio: string | null
          kms: number
          liquidado_at: string | null
          liquidado_by: number | null
          monto: number | null
          origen: string | null
          periodo_liquidacion: string | null
          tipo_movilidad: Database["public"]["Enums"]["tipo_movilidad"]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: number | null
          costo_km: number
          created_at?: string | null
          created_by?: number | null
          descripcion: string
          destino?: string | null
          estado?: Database["public"]["Enums"]["estado_movilidad"] | null
          fecha: string
          generado_automaticamente?: boolean
          id?: never
          id_cuenta_corriente?: number | null
          id_educador: number
          id_evento?: number | null
          id_honorario_tecnico?: number | null
          id_servicio?: string | null
          kms: number
          liquidado_at?: string | null
          liquidado_by?: number | null
          monto?: number | null
          origen?: string | null
          periodo_liquidacion?: string | null
          tipo_movilidad: Database["public"]["Enums"]["tipo_movilidad"]
        }
        Update: {
          approved_at?: string | null
          approved_by?: number | null
          costo_km?: number
          created_at?: string | null
          created_by?: number | null
          descripcion?: string
          destino?: string | null
          estado?: Database["public"]["Enums"]["estado_movilidad"] | null
          fecha?: string
          generado_automaticamente?: boolean
          id?: never
          id_cuenta_corriente?: number | null
          id_educador?: number
          id_evento?: number | null
          id_honorario_tecnico?: number | null
          id_servicio?: string | null
          kms?: number
          liquidado_at?: string | null
          liquidado_by?: number | null
          monto?: number | null
          origen?: string | null
          periodo_liquidacion?: string | null
          tipo_movilidad?: Database["public"]["Enums"]["tipo_movilidad"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_movilidad_approved_by"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_movilidad_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_movilidad_cuenta_corriente"
            columns: ["id_cuenta_corriente"]
            isOneToOne: false
            referencedRelation: "cuenta_corriente_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_movilidad_cuenta_corriente"
            columns: ["id_cuenta_corriente"]
            isOneToOne: false
            referencedRelation: "v_cc_detalle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_movilidad_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_movilidad_evento"
            columns: ["id_evento"]
            isOneToOne: false
            referencedRelation: "evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_movilidad_evento"
            columns: ["id_evento"]
            isOneToOne: false
            referencedRelation: "evento_con_emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movilidad_id_honorario_tecnico_fkey"
            columns: ["id_honorario_tecnico"]
            isOneToOne: false
            referencedRelation: "honorarios_tecnicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movilidad_id_honorario_tecnico_fkey"
            columns: ["id_honorario_tecnico"]
            isOneToOne: false
            referencedRelation: "v_movilidad_servicios_diagnostico"
            referencedColumns: ["id_honorario_real"]
          },
        ]
      }
      notificacion: {
        Row: {
          actor_id: number | null
          archivada: boolean
          archivada_at: string | null
          created_at: string
          entidad_id: string | null
          entidad_tipo: string | null
          id: string
          id_educador: number
          incluida_en_digest: boolean
          is_deleted: boolean
          leida: boolean
          leida_at: string | null
          mensaje: string | null
          metadata: Json | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          url: string | null
        }
        Insert: {
          actor_id?: number | null
          archivada?: boolean
          archivada_at?: string | null
          created_at?: string
          entidad_id?: string | null
          entidad_tipo?: string | null
          id?: string
          id_educador: number
          incluida_en_digest?: boolean
          is_deleted?: boolean
          leida?: boolean
          leida_at?: string | null
          mensaje?: string | null
          metadata?: Json | null
          tipo: Database["public"]["Enums"]["tipo_notificacion"]
          titulo: string
          url?: string | null
        }
        Update: {
          actor_id?: number | null
          archivada?: boolean
          archivada_at?: string | null
          created_at?: string
          entidad_id?: string | null
          entidad_tipo?: string | null
          id?: string
          id_educador?: number
          incluida_en_digest?: boolean
          is_deleted?: boolean
          leida?: boolean
          leida_at?: string | null
          mensaje?: string | null
          metadata?: Json | null
          tipo?: Database["public"]["Enums"]["tipo_notificacion"]
          titulo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacion_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "notificacion_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      notificacion_preferencias: {
        Row: {
          created_at: string
          digest_dia_semana: number
          digest_email_habilitado: boolean
          id: string
          id_educador: number
          tipos_deshabilitados:
            | Database["public"]["Enums"]["tipo_notificacion"][]
            | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          digest_dia_semana?: number
          digest_email_habilitado?: boolean
          id?: string
          id_educador: number
          tipos_deshabilitados?:
            | Database["public"]["Enums"]["tipo_notificacion"][]
            | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          digest_dia_semana?: number
          digest_email_habilitado?: boolean
          id?: string
          id_educador?: number
          tipos_deshabilitados?:
            | Database["public"]["Enums"]["tipo_notificacion"][]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacion_preferencias_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: true
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      planificacion_proyeccion: {
        Row: {
          cantidad: number | null
          created_at: string | null
          created_by: number | null
          descuento_porcentaje: number | null
          dias_campo_proy: number | null
          dias_gabinete_proy: number | null
          educadores_proy: number[] | null
          ejercicio_fiscal: string
          grupo: string | null
          id: string
          id_establecimiento: string | null
          id_servicio: string | null
          kg_dia_proy: number | null
          notas: string | null
          probabilidad: number | null
          repite: boolean | null
          servicio_proyectado: string | null
          updated_at: string | null
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          created_by?: number | null
          descuento_porcentaje?: number | null
          dias_campo_proy?: number | null
          dias_gabinete_proy?: number | null
          educadores_proy?: number[] | null
          ejercicio_fiscal?: string
          grupo?: string | null
          id?: string
          id_establecimiento?: string | null
          id_servicio?: string | null
          kg_dia_proy?: number | null
          notas?: string | null
          probabilidad?: number | null
          repite?: boolean | null
          servicio_proyectado?: string | null
          updated_at?: string | null
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          created_by?: number | null
          descuento_porcentaje?: number | null
          dias_campo_proy?: number | null
          dias_gabinete_proy?: number | null
          educadores_proy?: number[] | null
          ejercicio_fiscal?: string
          grupo?: string | null
          id?: string
          id_establecimiento?: string | null
          id_servicio?: string | null
          kg_dia_proy?: number | null
          notas?: string | null
          probabilidad?: number | null
          repite?: boolean | null
          servicio_proyectado?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planificacion_proyeccion_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "planificacion_proyeccion_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      plantilla_presupuesto: {
        Row: {
          condiciones_pago: string | null
          created_at: string
          descripcion: string | null
          descripcion_header: string | null
          descripcion_servicio: string | null
          duracion_anios: number | null
          es_activo: boolean
          es_multiservicio: boolean | null
          exclusiones: string | null
          id: string
          id_esquema_facturacion: string | null
          id_tipo_servicio: number | null
          nombre: string
          notas_legales: string | null
          subtitulo: string | null
          titulo_documento: string
          updated_at: string
          vigencia_dias: number | null
        }
        Insert: {
          condiciones_pago?: string | null
          created_at?: string
          descripcion?: string | null
          descripcion_header?: string | null
          descripcion_servicio?: string | null
          duracion_anios?: number | null
          es_activo?: boolean
          es_multiservicio?: boolean | null
          exclusiones?: string | null
          id?: string
          id_esquema_facturacion?: string | null
          id_tipo_servicio?: number | null
          nombre: string
          notas_legales?: string | null
          subtitulo?: string | null
          titulo_documento?: string
          updated_at?: string
          vigencia_dias?: number | null
        }
        Update: {
          condiciones_pago?: string | null
          created_at?: string
          descripcion?: string | null
          descripcion_header?: string | null
          descripcion_servicio?: string | null
          duracion_anios?: number | null
          es_activo?: boolean
          es_multiservicio?: boolean | null
          exclusiones?: string | null
          id?: string
          id_esquema_facturacion?: string | null
          id_tipo_servicio?: number | null
          nombre?: string
          notas_legales?: string | null
          subtitulo?: string | null
          titulo_documento?: string
          updated_at?: string
          vigencia_dias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plantilla_presupuesto_id_esquema_facturacion_fkey"
            columns: ["id_esquema_facturacion"]
            isOneToOne: false
            referencedRelation: "esquema_facturacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plantilla_presupuesto_id_tipo_servicio_fkey"
            columns: ["id_tipo_servicio"]
            isOneToOne: false
            referencedRelation: "tipodeservicio_reftable"
            referencedColumns: ["id"]
          },
        ]
      }
      plantilla_seccion: {
        Row: {
          contenido_template: string
          created_at: string
          es_obligatoria: boolean
          id: string
          id_plantilla: string
          mostrar_titulo: boolean
          orden: number
          titulo_seccion: string
          updated_at: string
        }
        Insert: {
          contenido_template: string
          created_at?: string
          es_obligatoria?: boolean
          id?: string
          id_plantilla: string
          mostrar_titulo?: boolean
          orden?: number
          titulo_seccion: string
          updated_at?: string
        }
        Update: {
          contenido_template?: string
          created_at?: string
          es_obligatoria?: boolean
          id?: string
          id_plantilla?: string
          mostrar_titulo?: boolean
          orden?: number
          titulo_seccion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plantilla_seccion_id_plantilla_fkey"
            columns: ["id_plantilla"]
            isOneToOne: false
            referencedRelation: "plantilla_presupuesto"
            referencedColumns: ["id"]
          },
        ]
      }
      plantilla_servicio: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          descripcion_completa: string
          id: string
          link_informe_modelo: Json | null
          nombre: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          descripcion_completa: string
          id?: string
          link_informe_modelo?: Json | null
          nombre: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          descripcion_completa?: string
          id?: string
          link_informe_modelo?: Json | null
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      presupuesto: {
        Row: {
          aceptado_via_token: boolean | null
          cotizacion_al_emitir: number | null
          created_at: string
          created_by: string | null
          email_enviado_a: string | null
          email_enviado_at: string | null
          email_fallback_tecnicos: boolean | null
          es_migrado: boolean
          es_sin_cargo: boolean | null
          estado: Database["public"]["Enums"]["estado_presupuesto_nuevo"]
          fecha_aceptacion: string | null
          fecha_aprobacion: string | null
          fecha_emision: string
          fecha_envio: string | null
          fecha_rechazo: string | null
          fecha_vencimiento: string | null
          id: string
          id_empresa: string | null
          id_esquema_facturacion: string
          id_establecimiento: string | null
          id_plantilla: string | null
          id_presupuesto_consolidado: string | null
          is_deleted: boolean | null
          motivo_rechazo: string | null
          notas_internas: string | null
          numero: string
          observaciones: string | null
          pdf_generado_at: string | null
          pdf_storage_path: string | null
          total: number | null
          total_final: number | null
          total_honorarios: number
          total_movilidad: number
          total_otros: number
          unidad_cotizacion: string | null
          updated_at: string
          vigencia_dias: number | null
        }
        Insert: {
          aceptado_via_token?: boolean | null
          cotizacion_al_emitir?: number | null
          created_at?: string
          created_by?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          email_fallback_tecnicos?: boolean | null
          es_migrado?: boolean
          es_sin_cargo?: boolean | null
          estado?: Database["public"]["Enums"]["estado_presupuesto_nuevo"]
          fecha_aceptacion?: string | null
          fecha_aprobacion?: string | null
          fecha_emision?: string
          fecha_envio?: string | null
          fecha_rechazo?: string | null
          fecha_vencimiento?: string | null
          id?: string
          id_empresa?: string | null
          id_esquema_facturacion?: string
          id_establecimiento?: string | null
          id_plantilla?: string | null
          id_presupuesto_consolidado?: string | null
          is_deleted?: boolean | null
          motivo_rechazo?: string | null
          notas_internas?: string | null
          numero?: string
          observaciones?: string | null
          pdf_generado_at?: string | null
          pdf_storage_path?: string | null
          total?: number | null
          total_final?: number | null
          total_honorarios?: number
          total_movilidad?: number
          total_otros?: number
          unidad_cotizacion?: string | null
          updated_at?: string
          vigencia_dias?: number | null
        }
        Update: {
          aceptado_via_token?: boolean | null
          cotizacion_al_emitir?: number | null
          created_at?: string
          created_by?: string | null
          email_enviado_a?: string | null
          email_enviado_at?: string | null
          email_fallback_tecnicos?: boolean | null
          es_migrado?: boolean
          es_sin_cargo?: boolean | null
          estado?: Database["public"]["Enums"]["estado_presupuesto_nuevo"]
          fecha_aceptacion?: string | null
          fecha_aprobacion?: string | null
          fecha_emision?: string
          fecha_envio?: string | null
          fecha_rechazo?: string | null
          fecha_vencimiento?: string | null
          id?: string
          id_empresa?: string | null
          id_esquema_facturacion?: string
          id_establecimiento?: string | null
          id_plantilla?: string | null
          id_presupuesto_consolidado?: string | null
          is_deleted?: boolean | null
          motivo_rechazo?: string | null
          notas_internas?: string | null
          numero?: string
          observaciones?: string | null
          pdf_generado_at?: string | null
          pdf_storage_path?: string | null
          total?: number | null
          total_final?: number | null
          total_honorarios?: number
          total_movilidad?: number
          total_otros?: number
          unidad_cotizacion?: string | null
          updated_at?: string
          vigencia_dias?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_presupuesto_plantilla"
            columns: ["id_plantilla"]
            isOneToOne: false
            referencedRelation: "plantilla_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_esquema_facturacion_fkey"
            columns: ["id_esquema_facturacion"]
            isOneToOne: false
            referencedRelation: "esquema_facturacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_presupuesto_consolidado_fkey"
            columns: ["id_presupuesto_consolidado"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_presupuesto_consolidado_fkey"
            columns: ["id_presupuesto_consolidado"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "presupuesto_id_presupuesto_consolidado_fkey"
            columns: ["id_presupuesto_consolidado"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "presupuesto_id_presupuesto_consolidado_fkey"
            columns: ["id_presupuesto_consolidado"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_presupuesto_consolidado_fkey"
            columns: ["id_presupuesto_consolidado"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
        ]
      }
      proyecto_ayudantes: {
        Row: {
          id_educador: number
          id_proyecto: string
        }
        Insert: {
          id_educador: number
          id_proyecto: string
        }
        Update: {
          id_educador?: number
          id_proyecto?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_ayudantes_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "proyecto_ayudantes_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
        ]
      }
      proyecto_comentarios: {
        Row: {
          comment: string
          created_at: string | null
          created_by: number | null
          id: number
          id_proyecto: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          created_by?: number | null
          id?: number
          id_proyecto?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          created_by?: number | null
          id?: number
          id_proyecto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_comentarios_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "proyecto_comentarios_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
        ]
      }
      proyecto_documentos: {
        Row: {
          created_at: string | null
          id: number
          id_proyecto: string | null
          nombre: string | null
          subido_por: number | null
          tipo: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_proyecto?: string | null
          nombre?: string | null
          subido_por?: number | null
          tipo?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_proyecto?: string | null
          nombre?: string | null
          subido_por?: number | null
          tipo?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_documentos_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
          {
            foreignKeyName: "proyecto_documentos_subido_por_fkey"
            columns: ["subido_por"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      proyectos: {
        Row: {
          creado_por: number | null
          descripcion: string | null
          estado: string | null
          fecha_creacion: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          grupo: string | null
          id_proyecto: string
          nombre: string
          prioridad: string | null
          responsable_id: number
          trimestre: string | null
        }
        Insert: {
          creado_por?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          grupo?: string | null
          id_proyecto?: string
          nombre: string
          prioridad?: string | null
          responsable_id: number
          trimestre?: string | null
        }
        Update: {
          creado_por?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          grupo?: string | null
          id_proyecto?: string
          nombre?: string
          prioridad?: string | null
          responsable_id?: number
          trimestre?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proyectos_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "proyectos_responsable_id_fkey"
            columns: ["responsable_id"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      rendicion_servicio: {
        Row: {
          comentarios: string | null
          created_at: string | null
          created_by: number | null
          diferencias_educadores: boolean | null
          educadores_efectivos: Json
          estado: Database["public"]["Enums"]["estado_rendicion"] | null
          gastos_asociados_preview: Json | null
          gastos_creados: number[] | null
          id: number
          id_servicio: string
          motivo_rechazo: string | null
          rendido_at: string | null
          rendido_by: number | null
          revisado_at: string | null
          revisado_by: number | null
          total_kms_efectivos: number | null
          updated_at: string | null
        }
        Insert: {
          comentarios?: string | null
          created_at?: string | null
          created_by?: number | null
          diferencias_educadores?: boolean | null
          educadores_efectivos: Json
          estado?: Database["public"]["Enums"]["estado_rendicion"] | null
          gastos_asociados_preview?: Json | null
          gastos_creados?: number[] | null
          id?: never
          id_servicio: string
          motivo_rechazo?: string | null
          rendido_at?: string | null
          rendido_by?: number | null
          revisado_at?: string | null
          revisado_by?: number | null
          total_kms_efectivos?: number | null
          updated_at?: string | null
        }
        Update: {
          comentarios?: string | null
          created_at?: string | null
          created_by?: number | null
          diferencias_educadores?: boolean | null
          educadores_efectivos?: Json
          estado?: Database["public"]["Enums"]["estado_rendicion"] | null
          gastos_asociados_preview?: Json | null
          gastos_creados?: number[] | null
          id?: never
          id_servicio?: string
          motivo_rechazo?: string | null
          rendido_at?: string | null
          rendido_by?: number | null
          revisado_at?: string | null
          revisado_by?: number | null
          total_kms_efectivos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rendicion_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_rendicion_rendido_by"
            columns: ["rendido_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_rendicion_revisado_by"
            columns: ["revisado_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      ruuts_blacklist: {
        Row: {
          created_at: string | null
          created_by: string | null
          farm_id: string
          motivo: string
          nombre_ruuts: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          farm_id: string
          motivo: string
          nombre_ruuts?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          farm_id?: string
          motivo?: string
          nombre_ruuts?: string | null
        }
        Relationships: []
      }
      ruuts_import_staging: {
        Row: {
          "área de bosque (ha)": number | null
          "área de humedales (ha)": number | null
          "área desforestada (ha)": number | null
          "área elegible (ha)": number | null
          "Área protegida (ha)": number | null
          "Bosque nativo cat 1 (ha)": number | null
          "Bosque nativo cat 2 (ha)": number | null
          "Bosque nativo cat 3 (ha)": number | null
          Country: string | null
          "Doc legal (Drive)": string | null
          Hub: string | null
          id: string
          inserted_at: string | null
          "Internal Status": string | null
          "Legal status": string | null
          "MR Target": string | null
          Name: string | null
          "observaciones legales": string | null
          Province: string | null
          "Tipo de produccion": string | null
        }
        Insert: {
          "área de bosque (ha)"?: number | null
          "área de humedales (ha)"?: number | null
          "área desforestada (ha)"?: number | null
          "área elegible (ha)"?: number | null
          "Área protegida (ha)"?: number | null
          "Bosque nativo cat 1 (ha)"?: number | null
          "Bosque nativo cat 2 (ha)"?: number | null
          "Bosque nativo cat 3 (ha)"?: number | null
          Country?: string | null
          "Doc legal (Drive)"?: string | null
          Hub?: string | null
          id: string
          inserted_at?: string | null
          "Internal Status"?: string | null
          "Legal status"?: string | null
          "MR Target"?: string | null
          Name?: string | null
          "observaciones legales"?: string | null
          Province?: string | null
          "Tipo de produccion"?: string | null
        }
        Update: {
          "área de bosque (ha)"?: number | null
          "área de humedales (ha)"?: number | null
          "área desforestada (ha)"?: number | null
          "área elegible (ha)"?: number | null
          "Área protegida (ha)"?: number | null
          "Bosque nativo cat 1 (ha)"?: number | null
          "Bosque nativo cat 2 (ha)"?: number | null
          "Bosque nativo cat 3 (ha)"?: number | null
          Country?: string | null
          "Doc legal (Drive)"?: string | null
          Hub?: string | null
          id?: string
          inserted_at?: string | null
          "Internal Status"?: string | null
          "Legal status"?: string | null
          "MR Target"?: string | null
          Name?: string | null
          "observaciones legales"?: string | null
          Province?: string | null
          "Tipo de produccion"?: string | null
        }
        Relationships: []
      }
      ruuts_sync_log: {
        Row: {
          changes: Json | null
          farm_id: string | null
          id: number
          id_establecimiento: string | null
          log_type: string
          message: string | null
          nombre_perennia: string | null
          nombre_ruuts: string | null
          sync_batch_id: string
          sync_timestamp: string | null
        }
        Insert: {
          changes?: Json | null
          farm_id?: string | null
          id?: never
          id_establecimiento?: string | null
          log_type: string
          message?: string | null
          nombre_perennia?: string | null
          nombre_ruuts?: string | null
          sync_batch_id: string
          sync_timestamp?: string | null
        }
        Update: {
          changes?: Json | null
          farm_id?: string | null
          id?: never
          id_establecimiento?: string | null
          log_type?: string
          message?: string | null
          nombre_perennia?: string | null
          nombre_ruuts?: string | null
          sync_batch_id?: string
          sync_timestamp?: string | null
        }
        Relationships: []
      }
      snapshot_cuota_lineas: {
        Row: {
          cantidad: number
          created_at: string
          descripcion: string
          id: string
          id_cuota: string
          id_linea_presupuesto: string | null
          id_servicio: string | null
          monto_unidades: number
          numero_linea: number
          tipo_detalle: string
          unidad_medida: string
          unidad_monto: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string
          descripcion: string
          id?: string
          id_cuota: string
          id_linea_presupuesto?: string | null
          id_servicio?: string | null
          monto_unidades: number
          numero_linea: number
          tipo_detalle?: string
          unidad_medida?: string
          unidad_monto?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string
          descripcion?: string
          id?: string
          id_cuota?: string
          id_linea_presupuesto?: string | null
          id_servicio?: string | null
          monto_unidades?: number
          numero_linea?: number
          tipo_detalle?: string
          unidad_medida?: string
          unidad_monto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "snapshot_cuota_lineas_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snapshot_cuota_lineas_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "snapshot_cuota_lineas_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "linea_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snapshot_cuota_lineas_id_linea_presupuesto_fkey"
            columns: ["id_linea_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_linea"]
          },
        ]
      }
      solicitud_factura: {
        Row: {
          aprobada_por: number | null
          cotizacion_usada: number | null
          created_at: string | null
          estado: string
          fecha_aprobacion: string | null
          id: string
          id_cuota: string | null
          id_empresa: string
          id_factura_generada: number | null
          id_presupuesto: string
          id_tecnico_asignado: number | null
          is_deleted: boolean | null
          monto_honorarios_pesos: number | null
          monto_honorarios_unidades: number | null
          monto_movilidad_pesos: number | null
          motivo_rechazo: string | null
          motivo_sugerencia: string | null
          numero_cuota: number
          quien_factura: string
          quien_factura_sugerido: string | null
          tabla_factura: string | null
          tipo_factura_sugerido: string | null
          unidad_cotizacion: string | null
          updated_at: string | null
          warnings: Json | null
        }
        Insert: {
          aprobada_por?: number | null
          cotizacion_usada?: number | null
          created_at?: string | null
          estado?: string
          fecha_aprobacion?: string | null
          id?: string
          id_cuota?: string | null
          id_empresa: string
          id_factura_generada?: number | null
          id_presupuesto: string
          id_tecnico_asignado?: number | null
          is_deleted?: boolean | null
          monto_honorarios_pesos?: number | null
          monto_honorarios_unidades?: number | null
          monto_movilidad_pesos?: number | null
          motivo_rechazo?: string | null
          motivo_sugerencia?: string | null
          numero_cuota: number
          quien_factura?: string
          quien_factura_sugerido?: string | null
          tabla_factura?: string | null
          tipo_factura_sugerido?: string | null
          unidad_cotizacion?: string | null
          updated_at?: string | null
          warnings?: Json | null
        }
        Update: {
          aprobada_por?: number | null
          cotizacion_usada?: number | null
          created_at?: string | null
          estado?: string
          fecha_aprobacion?: string | null
          id?: string
          id_cuota?: string | null
          id_empresa?: string
          id_factura_generada?: number | null
          id_presupuesto?: string
          id_tecnico_asignado?: number | null
          is_deleted?: boolean | null
          monto_honorarios_pesos?: number | null
          monto_honorarios_unidades?: number | null
          monto_movilidad_pesos?: number | null
          motivo_rechazo?: string | null
          motivo_sugerencia?: string | null
          numero_cuota?: number
          quien_factura?: string
          quien_factura_sugerido?: string | null
          tabla_factura?: string | null
          tipo_factura_sugerido?: string | null
          unidad_cotizacion?: string | null
          updated_at?: string | null
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_factura_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "solicitud_factura_id_tecnico_asignado_fkey"
            columns: ["id_tecnico_asignado"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      tarea_comentarios: {
        Row: {
          comment: string
          created_at: string | null
          created_by: number | null
          id: number
          tarea_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          created_by?: number | null
          id?: never
          tarea_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          created_by?: number | null
          id?: never
          tarea_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarea_comentarios_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "tarea_comentarios_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "tareas"
            referencedColumns: ["id_tarea"]
          },
        ]
      }
      tareas: {
        Row: {
          creado_por: number | null
          descripcion: string | null
          estado: string | null
          fecha_creacion: string
          fecha_limite: string | null
          fecha_ultima_modificacion: string
          generada_automaticamente: boolean | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          id_educador: number | null
          id_establecimiento: string | null
          id_proyecto: string | null
          id_servicio: string | null
          id_tarea: string
          is_deleted: boolean
          modificado_por: number | null
          prioridad: string | null
          recordatorio: boolean
          tipo_tarea: string | null
          titulo: string | null
        }
        Insert: {
          creado_por?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string
          fecha_limite?: string | null
          fecha_ultima_modificacion?: string
          generada_automaticamente?: boolean | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id_educador?: number | null
          id_establecimiento?: string | null
          id_proyecto?: string | null
          id_servicio?: string | null
          id_tarea: string
          is_deleted?: boolean
          modificado_por?: number | null
          prioridad?: string | null
          recordatorio?: boolean
          tipo_tarea?: string | null
          titulo?: string | null
        }
        Update: {
          creado_por?: number | null
          descripcion?: string | null
          estado?: string | null
          fecha_creacion?: string
          fecha_limite?: string | null
          fecha_ultima_modificacion?: string
          generada_automaticamente?: boolean | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id_educador?: number | null
          id_establecimiento?: string | null
          id_proyecto?: string | null
          id_servicio?: string | null
          id_tarea?: string
          is_deleted?: boolean
          modificado_por?: number | null
          prioridad?: string | null
          recordatorio?: boolean
          tipo_tarea?: string | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tareas_creado_por_id_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "tareas_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "tareas_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "tareas_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "tareas_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "tareas_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "tareas_id_proyecto_fkey"
            columns: ["id_proyecto"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id_proyecto"]
          },
          {
            foreignKeyName: "tareas_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "tareas_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "tareas_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "tareas_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "tareas_modificado_por_id_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      temporada: {
        Row: {
          codigo: string
          es_actual: boolean
          fecha_fin: string
          fecha_inicio: string
        }
        Insert: {
          codigo: string
          es_actual?: boolean
          fecha_fin: string
          fecha_inicio: string
        }
        Update: {
          codigo?: string
          es_actual?: boolean
          fecha_fin?: string
          fecha_inicio?: string
        }
        Relationships: []
      }
      tipodeservicio_reftable: {
        Row: {
          abreviacion: string | null
          categoria_gantt: string[]
          codigos_plantilla: string[]
          componentes_informe: string[]
          es_servicio_compuesto: boolean
          id: number
          servicio_agrupado:
            | Database["public"]["Enums"]["servicio_agrupado"]
            | null
          subcarpeta_drive: string[]
          subcarpeta_drive_2: string[] | null
          tipodeservicio: string | null
        }
        Insert: {
          abreviacion?: string | null
          categoria_gantt?: string[]
          codigos_plantilla?: string[]
          componentes_informe?: string[]
          es_servicio_compuesto?: boolean
          id: number
          servicio_agrupado?:
            | Database["public"]["Enums"]["servicio_agrupado"]
            | null
          subcarpeta_drive?: string[]
          subcarpeta_drive_2?: string[] | null
          tipodeservicio?: string | null
        }
        Update: {
          abreviacion?: string | null
          categoria_gantt?: string[]
          codigos_plantilla?: string[]
          componentes_informe?: string[]
          es_servicio_compuesto?: boolean
          id?: number
          servicio_agrupado?:
            | Database["public"]["Enums"]["servicio_agrupado"]
            | null
          subcarpeta_drive?: string[]
          subcarpeta_drive_2?: string[] | null
          tipodeservicio?: string | null
        }
        Relationships: []
      }
      tipodetarea_reftable: {
        Row: {
          accion_disparadora: string | null
          area: string | null
          descripcion: string | null
          frecuencia: string | null
          id: number
          responsable_sugerido: string | null
          tarea_frecuente: string | null
        }
        Insert: {
          accion_disparadora?: string | null
          area?: string | null
          descripcion?: string | null
          frecuencia?: string | null
          id: number
          responsable_sugerido?: string | null
          tarea_frecuente?: string | null
        }
        Update: {
          accion_disparadora?: string | null
          area?: string | null
          descripcion?: string | null
          frecuencia?: string | null
          id?: number
          responsable_sugerido?: string | null
          tarea_frecuente?: string | null
        }
        Relationships: []
      }
      token_confirmacion_presupuesto: {
        Row: {
          created_at: string | null
          expira_at: string | null
          id: string
          id_presupuesto: string
          is_deleted: boolean | null
          token: string
          usado_at: string | null
        }
        Insert: {
          created_at?: string | null
          expira_at?: string | null
          id?: string
          id_presupuesto: string
          is_deleted?: boolean | null
          token?: string
          usado_at?: string | null
        }
        Update: {
          created_at?: string | null
          expira_at?: string | null
          id?: string
          id_presupuesto?: string
          is_deleted?: boolean | null
          token?: string
          usado_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_confirmacion_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_confirmacion_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "token_confirmacion_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "token_confirmacion_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_confirmacion_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
        ]
      }
      token_upload_factura: {
        Row: {
          created_at: string | null
          expira_at: string | null
          id: string
          id_factura_tecnico: number
          token: string
          usado_at: string | null
        }
        Insert: {
          created_at?: string | null
          expira_at?: string | null
          id?: string
          id_factura_tecnico: number
          token?: string
          usado_at?: string | null
        }
        Update: {
          created_at?: string | null
          expira_at?: string | null
          id?: string
          id_factura_tecnico?: number
          token?: string
          usado_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "token_upload_factura_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "factura_tecnico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_upload_factura_id_factura_tecnico_fkey"
            columns: ["id_factura_tecnico"]
            isOneToOne: false
            referencedRelation: "v_facturas_tecnico"
            referencedColumns: ["id"]
          },
        ]
      }
      trigger_log: {
        Row: {
          detail: Json | null
          id: number
          operation: string
          row_id: string | null
          table_name: string
          trigger_name: string
          ts: string
          txid: number
        }
        Insert: {
          detail?: Json | null
          id?: never
          operation: string
          row_id?: string | null
          table_name: string
          trigger_name: string
          ts?: string
          txid?: number
        }
        Update: {
          detail?: Json | null
          id?: never
          operation?: string
          row_id?: string | null
          table_name?: string
          trigger_name?: string
          ts?: string
          txid?: number
        }
        Relationships: []
      }
      update_temp_establecimientos: {
        Row: {
          farm_id: string | null
          id_establecimiento: string
        }
        Insert: {
          farm_id?: string | null
          id_establecimiento: string
        }
        Update: {
          farm_id?: string | null
          id_establecimiento?: string
        }
        Relationships: []
      }
      valor_kilometro_referencia: {
        Row: {
          activo: boolean | null
          created_at: string | null
          created_by: number | null
          descripcion: string | null
          fecha_desde: string
          fecha_hasta: string | null
          id: number
          updated_at: string | null
          valor_km: number
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          fecha_desde: string
          fecha_hasta?: string | null
          id?: never
          updated_at?: string | null
          valor_km: number
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          fecha_desde?: string
          fecha_hasta?: string | null
          id?: never
          updated_at?: string | null
          valor_km?: number
        }
        Relationships: []
      }
      whatsapp_configs: {
        Row: {
          business_account_id: string
          created_at: string | null
          customer_id: string | null
          id: string
          name: string | null
          phone_number: string
          phone_number_id: string
          updated_at: string | null
        }
        Insert: {
          business_account_id: string
          created_at?: string | null
          customer_id?: string | null
          id: string
          name?: string | null
          phone_number: string
          phone_number_id: string
          updated_at?: string | null
        }
        Update: {
          business_account_id?: string
          created_at?: string | null
          customer_id?: string | null
          id?: string
          name?: string | null
          phone_number?: string
          phone_number_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_contacts: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          metadata: Json | null
          profile_name: string | null
          project_id: string
          updated_at: string | null
          wa_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id: string
          metadata?: Json | null
          profile_name?: string | null
          project_id: string
          updated_at?: string | null
          wa_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          profile_name?: string | null
          project_id?: string
          updated_at?: string | null
          wa_id?: string
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          last_active_at: string | null
          phone_number: string | null
          status: string | null
          updated_at: string | null
          whatsapp_config_id: string | null
        }
        Insert: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id: string
          last_active_at?: string | null
          phone_number?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_config_id?: string | null
        }
        Update: {
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_active_at?: string | null
          phone_number?: string | null
          status?: string | null
          updated_at?: string | null
          whatsapp_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_whatsapp_config_id_fkey"
            columns: ["whatsapp_config_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string | null
          direction: string | null
          has_media: boolean | null
          id: string
          media_filename: string | null
          media_size: number | null
          media_type: string | null
          media_url: string | null
          message_type: string | null
          metadata: Json | null
          status: string | null
          updated_at: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string | null
          direction?: string | null
          has_media?: boolean | null
          id: string
          media_filename?: string | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          direction?: string | null
          has_media?: boolean | null
          id?: string
          media_filename?: string | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      agenda_con_nombres_educadores: {
        Row: {
          "% Descuento": number | null
          "Dias de campo": number | null
          "Dias de Gabinete": number | null
          educadores: number[] | null
          Establecimiento: string | null
          Estado: Database["public"]["Enums"]["Estado"] | null
          "Estado del Presupuesto": number | null
          "Estado del Trabajo": number | null
          Fecha: string | null
          "Fecha Envio Informe": string | null
          "Fecha fin servicio": string | null
          Grupo: Database["public"]["Enums"]["Grupos"] | null
          id_establecimientoAsociado: string | null
          id_servicio: string | null
          "KMS Presupuestados": number | null
          "Link Informe Drive": string | null
          Localidad: string | null
          "Movilidad a facturar al Productor": number | null
          nombres_educadores: string | null
          "Precio Unidades": number | null
          Servicio: string | null
          "Sub Total": number | null
          "Tipo de unidad":
            | Database["public"]["Enums"]["Unidades de Facturacion"]
            | null
          "Total Honorarios": number | null
          "Total Servicio": number | null
          "Unidades Presupuestadas": number | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimientoAsociado"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimientoAsociado"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimientoAsociado"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimientoAsociado"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      empresas_con_establecimiento: {
        Row: {
          cuit: number | null
          es_principal: boolean | null
          id_empresa: string | null
          id_establecimientoasociado: string | null
          iva: Database["public"]["Enums"]["factura"] | null
          last_edited: string | null
          last_edited_by: string | null
          nombre_establecimiento_asociado: string | null
          preferencia_factura: string | null
          razonsocial: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimientoasociado"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimientoasociado"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimientoasociado"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimientoasociado"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      evento_con_emails: {
        Row: {
          calendario_id: string | null
          cant_asistentes: number | null
          cliente_establecimiento: string | null
          contactos_invitados: string[] | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: number | null
          descripcion_detallada: string | null
          educadores_internos: number[] | null
          emails_participantes: string[] | null
          es_dia_completo: boolean | null
          es_reunion_principal: boolean | null
          evento_padre_id: number | null
          fecha_hora_fin: string | null
          fecha_hora_inicio: string | null
          google_calendar_event_id: string | null
          google_meet_url: string | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          id: number | null
          incluir_google_meet: boolean | null
          is_deleted: boolean | null
          last_edited_calendar: string | null
          localidad: string | null
          minuta: string | null
          nombre: string | null
          presupuesto_movilidad: number | null
          requiere_movilidad: boolean | null
          tipo_evento: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Insert: {
          calendario_id?: string | null
          cant_asistentes?: number | null
          cliente_establecimiento?: string | null
          contactos_invitados?: string[] | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          descripcion_detallada?: string | null
          educadores_internos?: number[] | null
          emails_participantes?: never
          es_dia_completo?: boolean | null
          es_reunion_principal?: boolean | null
          evento_padre_id?: number | null
          fecha_hora_fin?: string | null
          fecha_hora_inicio?: string | null
          google_calendar_event_id?: string | null
          google_meet_url?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id?: number | null
          incluir_google_meet?: boolean | null
          is_deleted?: boolean | null
          last_edited_calendar?: string | null
          localidad?: string | null
          minuta?: string | null
          nombre?: string | null
          presupuesto_movilidad?: number | null
          requiere_movilidad?: boolean | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Update: {
          calendario_id?: string | null
          cant_asistentes?: number | null
          cliente_establecimiento?: string | null
          contactos_invitados?: string[] | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          descripcion_detallada?: string | null
          educadores_internos?: number[] | null
          emails_participantes?: never
          es_dia_completo?: boolean | null
          es_reunion_principal?: boolean | null
          evento_padre_id?: number | null
          fecha_hora_fin?: string | null
          fecha_hora_inicio?: string | null
          google_calendar_event_id?: string | null
          google_meet_url?: string | null
          grupo?: Database["public"]["Enums"]["Grupos"] | null
          id?: number | null
          incluir_google_meet?: boolean | null
          is_deleted?: boolean | null
          last_edited_calendar?: string | null
          localidad?: string | null
          minuta?: string | null
          nombre?: string | null
          presupuesto_movilidad?: number | null
          requiere_movilidad?: boolean | null
          tipo_evento?: Database["public"]["Enums"]["tipo_evento"] | null
        }
        Relationships: [
          {
            foreignKeyName: "evento_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "evento_evento_padre_id_fkey"
            columns: ["evento_padre_id"]
            isOneToOne: false
            referencedRelation: "evento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_evento_padre_id_fkey"
            columns: ["evento_padre_id"]
            isOneToOne: false
            referencedRelation: "evento_con_emails"
            referencedColumns: ["id"]
          },
        ]
      }
      liquidacion_honorarios_fijos: {
        Row: {
          alias: string | null
          "Dolares Mep": number | null
          estado_liquidacion: string | null
          "Facturas de No Reembolsables": number | null
          "Facturas de reembolsables": number | null
          "Gastos a Reembolsar": number | null
          "Gastos Tarjeta no reembolsables": number | null
          id: string | null
          id_educador: number | null
          "Kgs Novillo": number | null
          "Kms no cubiertos (real)": number | null
          Mes: string | null
          "Movilidad a Facturar": number | null
          "Total a Cobrar de Perennia": number | null
          "Total a Facturar Perennia": number | null
          "Total Honorarios": number | null
          valor_inmag: number | null
          valor_mep: number | null
        }
        Relationships: [
          {
            foreignKeyName: "honorarios_fijos_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      pagos_facturas_subidas: {
        Row: {
          mes: string | null
          mes_fecha: string | null
          porcentaje: number | null
          proporcion: number | null
          suma_monto_efectivo: number | null
          suma_total_honorarios: number | null
        }
        Relationships: []
      }
      servicios_moneda_constante: {
        Row: {
          dias_campo: number | null
          dias_gabinete: number | null
          fecha: string | null
          fiscal_cuatrimestre: string | null
          fiscal_year: number | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          honorarios_constantes: number | null
          honorarios_efectivos_pagados: number | null
          honorarios_kgs: number | null
          honorarios_usd: number | null
          id_establecimiento: string | null
          id_servicio: string | null
          kms_presupuestados: number | null
          mes: string | null
          monto_movilidad: number | null
          nombre_establecimiento: string | null
          servicio: string | null
          servicio_agrupado:
            | Database["public"]["Enums"]["servicio_agrupado"]
            | null
          temporada: string | null
          total_honorarios: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_cc_detalle: {
        Row: {
          descripcion: string | null
          fecha: string | null
          id: number | null
          id_educador: number | null
          monto: number | null
          saldo: number | null
          tipo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuenta_corriente_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_cuenta_corriente_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      v_comparacion_precios_presupuesto: {
        Row: {
          actividad_facturacion: string | null
          actividad_principal:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          alerta_descuento: string | null
          alerta_precio: string | null
          descuento_actual_pct: number | null
          descuento_ano_anterior_pct: number | null
          descuento_historico_pct: number | null
          dias_actual: number | null
          diferencia_vs_ano_anterior_pct: number | null
          diferencia_vs_historico_pct: number | null
          ev_establecimiento: number | null
          fecha_anterior: string | null
          litros_dia: number | null
          nombre_establecimiento: string | null
          presupuesto_creado: string | null
          presupuesto_estado:
            | Database["public"]["Enums"]["estado_presupuesto_nuevo"]
            | null
          presupuesto_id: string | null
          presupuesto_numero: string | null
          servicio_anterior: string | null
          servicios_historicos: number | null
          tipo_normalizado: string | null
          tipo_servicio: string | null
          ultimo_presupuesto_mismo_tipo: string | null
          unidad_precio: string | null
          unidades_por_dia_actual: number | null
          unidades_por_dia_anterior: number | null
          unidades_por_dia_historico: number | null
          unidades_promedio_historico: number | null
          unidades_totales_actual: number | null
        }
        Relationships: []
      }
      v_contactos_con_establecimientos: {
        Row: {
          apellido: string | null
          canal_preferido:
            | Database["public"]["Enums"]["canal_preferido_contacto"]
            | null
          cantidad_establecimientos: number | null
          establecimientos: string[] | null
          id_contacto: string | null
          mail: string | null
          nombre: string | null
          nombre_completo: string | null
          roles: string[] | null
          telefono: string | null
        }
        Relationships: []
      }
      v_contactos_establecimientos: {
        Row: {
          apellido: string | null
          canal_preferido:
            | Database["public"]["Enums"]["canal_preferido_contacto"]
            | null
          contacto_created_at: string | null
          es_principal: boolean | null
          estado_establecimiento: string | null
          id_contacto: string | null
          id_establecimiento: string | null
          localidad: string | null
          mail: string | null
          nombre: string | null
          nombre_completo: string | null
          nombre_establecimiento: string | null
          notas_relacion: string | null
          relacion_created_at: string | null
          rol:
            | Database["public"]["Enums"]["rol_contacto_establecimiento"]
            | null
          telefono: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "contacto_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_cuotas_pendientes: {
        Row: {
          dias_para_facturar: number | null
          empresa_nombre: string | null
          esta_vencida: boolean | null
          establecimiento_nombre: string | null
          estado: Database["public"]["Enums"]["estado_cuota"] | null
          estado_presupuesto:
            | Database["public"]["Enums"]["estado_presupuesto_nuevo"]
            | null
          fecha_programada: string | null
          id_cuota: string | null
          id_empresa: string | null
          id_establecimiento: string | null
          id_presupuesto: string | null
          monto: number | null
          numero_cuota: number | null
          numero_presupuesto: string | null
          porcentaje: number | null
          tipo_factura: Database["public"]["Enums"]["factura"] | null
          trigger_cumplido: boolean | null
          trigger_habilitacion: Json | null
          unidad_cotizacion: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuota_presupuesto_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_dashboard_facturacion: {
        Row: {
          aprobada_por: number | null
          aprobado_por_nombre: string | null
          archivo_url: string | null
          cae: string | null
          cae_vencimiento: string | null
          cotizacion_usada: number | null
          dias_desde_creacion: number | null
          dias_desde_emision: number | null
          email_enviado_a: string | null
          empresa_cuit: string | null
          empresa_iva: Database["public"]["Enums"]["factura"] | null
          empresa_nombre: string | null
          estado_display: string | null
          estado_orden: number | null
          estado_original: string | null
          factura_id: number | null
          fecha_aprobacion: string | null
          fecha_cobro: string | null
          fecha_creacion: string | null
          fecha_emision: string | null
          fecha_envio_email: string | null
          id_cuota: string | null
          id_empresa: string | null
          id_establecimiento: string | null
          id_presupuesto: string | null
          id_unico: string | null
          monto_honorarios_pesos: number | null
          monto_honorarios_unidades: number | null
          monto_movilidad_kms: number | null
          monto_movilidad_pesos: number | null
          monto_movilidad_unidades: number | null
          monto_total_pesos: number | null
          motivo_nc: string | null
          motivo_rechazo: string | null
          motivo_sugerencia: string | null
          nc_id: number | null
          nc_nro_factura: string | null
          nombre_establecimiento: string | null
          nro_factura: string | null
          numero_cuota: number | null
          pdf_storage_path: string | null
          presupuesto_numero: string | null
          quien_factura: string | null
          servicio_nombre: string | null
          solicitud_id: string | null
          tecnico_id: number | null
          tecnico_nombre: string | null
          tipo_factura: string | null
          tipo_registro: string | null
          total_cuotas: number | null
          unidad_cotizacion: string | null
        }
        Relationships: []
      }
      v_dashboard_movilidad: {
        Row: {
          alertas: Json | null
          generado_at: string | null
          kms_mes_actual: number | null
          kms_pendientes_liquidacion: number | null
          monto_mes_actual: number | null
          monto_pendiente_liquidacion: number | null
          movilidad_pendiente_aprobacion: number | null
          periodos_vencidos_liquidacion: number | null
          rendiciones_pendientes: number | null
        }
        Relationships: []
      }
      v_desvio_dias_presupuesto: {
        Row: {
          descripcion: string | null
          desvio_campo: number | null
          desvio_gabinete: number | null
          desvio_total: number | null
          dias_campo_ejecutados: number | null
          dias_campo_presupuestados: number | null
          dias_gabinete_ejecutados: number | null
          dias_gabinete_presupuestados: number | null
          dias_totales_ejecutados: number | null
          dias_totales_presupuestados: number | null
          establecimiento_nombre: string | null
          estado_presupuesto:
            | Database["public"]["Enums"]["estado_presupuesto_nuevo"]
            | null
          id_linea: string | null
          id_presupuesto: string | null
          id_servicio: string | null
          numero_presupuesto: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "linea_presupuesto_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      v_diagnostico_movilidad_liquidacion: {
        Row: {
          cant_registros_cc: number | null
          cant_registros_movilidad: number | null
          diferencia: number | null
          estado_sincronizacion: string | null
          id_educador: number | null
          monto_cuenta_corriente: number | null
          monto_tabla_movilidad: number | null
          nombre_educador: string | null
          periodo: string | null
        }
        Relationships: []
      }
      v_empresas_con_establecimientos: {
        Row: {
          cantidad_establecimientos: number | null
          cuit: number | null
          domicilio_fiscal: string | null
          establecimientos: string[] | null
          id_empresa: string | null
          iva: Database["public"]["Enums"]["factura"] | null
          razonsocial: string | null
        }
        Relationships: []
      }
      v_empresas_configuracion_facturacion: {
        Row: {
          cuit: number | null
          estado_configuracion: string | null
          facturas_perennia: number | null
          facturas_tecnico: number | null
          id_empresa: string | null
          iva: Database["public"]["Enums"]["factura"] | null
          preferencia_factura: string | null
          razonsocial: string | null
          tecnico_historico: number | null
          tecnico_nombre: string | null
        }
        Relationships: []
      }
      v_empresas_establecimientos: {
        Row: {
          cuit: number | null
          domicilio_fiscal: string | null
          empresa_last_edited: string | null
          es_principal: boolean | null
          estado_establecimiento: string | null
          id_empresa: string | null
          id_establecimiento: string | null
          iva: Database["public"]["Enums"]["factura"] | null
          localidad: string | null
          nombre_establecimiento: string | null
          notas_relacion: string | null
          preferencia_factura: string | null
          razonsocial: string | null
          relacion_created_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_establecimiento_detalle: {
        Row: {
          actividad_principal:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          area_total: number | null
          cantidad_contactos: number | null
          cantidad_empresas: number | null
          empresa_principal: string | null
          estado: string | null
          grupo:
            | Database["public"]["Enums"]["enum_establecimiento_grupo"]
            | null
          id_establecimiento: string | null
          localidad: string | null
          nombre_establecimiento: string | null
          productor_principal: string | null
          telefono_productor: string | null
        }
        Insert: {
          actividad_principal?:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          area_total?: number | null
          cantidad_contactos?: never
          cantidad_empresas?: never
          empresa_principal?: never
          estado?: string | null
          grupo?:
            | Database["public"]["Enums"]["enum_establecimiento_grupo"]
            | null
          id_establecimiento?: string | null
          localidad?: string | null
          nombre_establecimiento?: string | null
          productor_principal?: never
          telefono_productor?: never
        }
        Update: {
          actividad_principal?:
            | Database["public"]["Enums"]["actividad_principal"]
            | null
          area_total?: number | null
          cantidad_contactos?: never
          cantidad_empresas?: never
          empresa_principal?: never
          estado?: string | null
          grupo?:
            | Database["public"]["Enums"]["enum_establecimiento_grupo"]
            | null
          id_establecimiento?: string | null
          localidad?: string | null
          nombre_establecimiento?: string | null
          productor_principal?: never
          telefono_productor?: never
        }
        Relationships: []
      }
      v_establecimiento_empresas: {
        Row: {
          empresa_cuit: number | null
          empresa_iva: Database["public"]["Enums"]["factura"] | null
          empresa_nombre: string | null
          es_principal: boolean | null
          id_empresa: string | null
          id_establecimiento: string | null
          nombre_establecimiento: string | null
          preferencia_factura: string | null
          total_empresas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "empresa_establecimiento_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_estado_sync_indices: {
        Row: {
          indice: string | null
          registros_totales: number | null
          ultima_fecha: string | null
          ultimo_valor: number | null
        }
        Relationships: []
      }
      v_facturacion_establecimiento: {
        Row: {
          area_base_fuente: string | null
          area_base_valor: number | null
          area_mh: number | null
          area_total: number | null
          area_verificable: number | null
          dias_total: number | null
          ev_mh: number | null
          grupo: string | null
          id_establecimiento: string | null
          kgs_por_dia: number | null
          kgs_por_ev: number | null
          kgs_por_ha_base: number | null
          kgs_por_servicio: number | null
          kgs_total: number | null
          nombre_establecimiento: string | null
          periodo_fin: string | null
          periodo_inicio: string | null
          servicios_count: number | null
        }
        Relationships: []
      }
      v_facturas_all: {
        Row: {
          contraparte: string | null
          cuit: number | null
          descripcion: string | null
          educador_alias: string | null
          educador_cuit: number | null
          educador_nombre: string | null
          estado: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          factura_id: number | null
          fecha: string | null
          fecha_cobro: string | null
          id_educador: number | null
          id_servicio: string | null
          monto_iva: number | null
          monto_neto: number | null
          monto_total: number | null
          nro_factura: string | null
          origen: string | null
          tipo_factura: Database["public"]["Enums"]["factura"] | null
        }
        Relationships: []
      }
      v_facturas_con_nc: {
        Row: {
          cae: string | null
          cantidad_nc_asociadas: number | null
          estado: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          factura_original_cae: string | null
          factura_original_nro: string | null
          fecha: string | null
          id: number | null
          id_empresa: string | null
          id_factura_original: number | null
          id_servicio: string | null
          monto_total: number | null
          motivo_nc: string | null
          nro_factura: string | null
          tipo_factura: Database["public"]["Enums"]["factura"] | null
          total_nc_asociadas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "factura_perennia_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "factura_perennia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_perennia_id_factura_original_fkey"
            columns: ["id_factura_original"]
            isOneToOne: false
            referencedRelation: "v_facturas_con_nc"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "factura_productor_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      v_facturas_tecnico: {
        Row: {
          CUIT: number | null
          Descripción: string | null
          Estado: Database["public"]["Enums"]["estado_factura_tecnico"] | null
          Fecha: string | null
          "Fecha Cobro": string | null
          id: number | null
          id_educador: number | null
          id_empresa: string | null
          IVA: number | null
          Monto: number | null
          "Monto Neto": number | null
          "Razon Social": string | null
        }
        Relationships: [
          {
            foreignKeyName: "factura_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "fk_factura_empresa"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
        ]
      }
      v_gantt_pivot: {
        Row: {
          "Diagnóstico 21-22": number | null
          "Diagnóstico 22-23": number | null
          "Diagnóstico 23-24": number | null
          "Diagnóstico 24-25": number | null
          "Diagnóstico 25-26": number | null
          fecha_primer_servicio: string | null
          fecha_ultimo_servicio: string | null
          grupo: string | null
          id_establecimiento: string | null
          "LB GRASS 21-22": number | null
          "LB GRASS 22-23": number | null
          "LB GRASS 23-24": number | null
          "LB GRASS 24-25": number | null
          "MCP 21-22": number | null
          "MCP 22-23": number | null
          "MCP 23-24": number | null
          "MCP 24-25": number | null
          "MCP 25-26": number | null
          "otros 21-22": number | null
          "otros 22-23": number | null
          "otros 23-24": number | null
          "otros 24-25": number | null
          "otros 25-26": number | null
          "Plan Abierto 21-22": number | null
          "Plan Abierto 22-23": number | null
          "Plan Abierto 23-24": number | null
          "Plan Abierto 24-25": number | null
          "Plan Abierto 25-26": number | null
          "Plan Abierto 26-27": number | null
          "Plan Cerrado 21-22": number | null
          "Plan Cerrado 22-23": number | null
          "Plan Cerrado 23-24": number | null
          "Plan Cerrado 24-25": number | null
          tecnico_responsable: string | null
        }
        Relationships: []
      }
      v_gastos_fiscales_resumen: {
        Row: {
          fiscal_tag: string | null
          total: number | null
        }
        Relationships: []
      }
      v_gastos_pendiente_autorizacion: {
        Row: {
          categoria: string | null
          centro_costo: string | null
          comprobante_regalado: boolean | null
          comprobante_url: string | null
          created_at: string | null
          created_by: number | null
          descripcion: string | null
          es_reembolsable: boolean | null
          estado_gasto:
            | Database["public"]["Enums"]["estado_gasto_tecnico"]
            | null
          fecha: string | null
          fiscal_tag: string | null
          id: number | null
          id_educador: number | null
          id_servicio: string | null
          metodo_pago: Database["public"]["Enums"]["metodo_pago"] | null
          monto: number | null
          tipo_factura: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Insert: {
          categoria?: string | null
          centro_costo?: string | null
          comprobante_regalado?: boolean | null
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          es_reembolsable?: boolean | null
          estado_gasto?:
            | Database["public"]["Enums"]["estado_gasto_tecnico"]
            | null
          fecha?: string | null
          fiscal_tag?: string | null
          id?: number | null
          id_educador?: number | null
          id_servicio?: string | null
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          monto?: number | null
          tipo_factura?: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Update: {
          categoria?: string | null
          centro_costo?: string | null
          comprobante_regalado?: boolean | null
          comprobante_url?: string | null
          created_at?: string | null
          created_by?: number | null
          descripcion?: string | null
          es_reembolsable?: boolean | null
          estado_gasto?:
            | Database["public"]["Enums"]["estado_gasto_tecnico"]
            | null
          fecha?: string | null
          fiscal_tag?: string | null
          id?: number | null
          id_educador?: number | null
          id_servicio?: string | null
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          monto?: number | null
          tipo_factura?: Database["public"]["Enums"]["tipo_factura"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gastos_rendidos_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_gastos_rendidos_servicio"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_educador_fkey"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "gasto_tecnico_id_servicio_fkey"
            columns: ["id_servicio"]
            isOneToOne: false
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      v_honorarios_servicio: {
        Row: {
          dias_de_campo: number | null
          dias_de_gabinete: number | null
          estado_presupuesto: number | null
          estado_trabajo: number | null
          fecha: string | null
          grupo: Database["public"]["Enums"]["Grupos"] | null
          habilitado_pct: number | null
          habilitado_pct_decimal: number | null
          honorario_$: number | null
          honorario_id: string | null
          honorarios_totales_servicio: number | null
          id_educador: number | null
          id_establecimiento: string | null
          id_servicio: string | null
          kms: number | null
          movilidad_$: number | null
          origen: string | null
          porcentaje: number | null
          porcentaje_decimal: number | null
          servicio_nombre: string | null
        }
        Relationships: []
      }
      v_kms_historico_establecimiento: {
        Row: {
          coordenadas_establecimiento: string | null
          id_establecimiento: string | null
          kms_maximo: number | null
          kms_mediana: number | null
          kms_minimo: number | null
          kms_promedio: number | null
          localidad: string | null
          nombre_establecimiento: string | null
          servicios_distintos: number | null
          tecnicos_distintos: number | null
          total_viajes: number | null
          ultimo_viaje: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_movilidad_pendiente_liquidacion: {
        Row: {
          actividades_incluidas: string | null
          cantidad_registros: number | null
          educador_nombre: string | null
          es_servicio: boolean | null
          fecha_desde: string | null
          fecha_hasta: string | null
          id_educador: number | null
          monto_a_liquidar: number | null
          periodo: string | null
          periodo_vencido: boolean | null
          promedio_costo_km: number | null
          servicios_incluidos: string | null
          tipo_movilidad: Database["public"]["Enums"]["tipo_movilidad"] | null
          tipos_diferentes: number | null
          total_kms: number | null
          total_monto_registrado: number | null
          ultima_aprobacion: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_movilidad_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      v_movilidad_servicios_diagnostico: {
        Row: {
          costo_km: number | null
          costo_km_honorarios: number | null
          esta_sincronizado: boolean | null
          estado_movilidad:
            | Database["public"]["Enums"]["estado_movilidad"]
            | null
          estado_sincronizacion: string | null
          fecha_servicio: string | null
          honorario_created_at: string | null
          id_educador: number | null
          id_honorario_real: number | null
          id_honorario_tecnico: number | null
          id_servicio: string | null
          kms: number | null
          kms_honorarios: number | null
          monto_honorarios: number | null
          monto_movilidad: number | null
          movilidad_approved_at: string | null
          movilidad_created_at: string | null
          nombre_educador: string | null
          nombre_establecimiento: string | null
          servicio: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_movilidad_educador"
            columns: ["id_educador"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "movilidad_id_honorario_tecnico_fkey"
            columns: ["id_honorario_tecnico"]
            isOneToOne: false
            referencedRelation: "honorarios_tecnicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movilidad_id_honorario_tecnico_fkey"
            columns: ["id_honorario_tecnico"]
            isOneToOne: false
            referencedRelation: "v_movilidad_servicios_diagnostico"
            referencedColumns: ["id_honorario_real"]
          },
        ]
      }
      v_plantilla_servicios_6m: {
        Row: {
          dias_campo_prev: number | null
          dias_gab_prev: number | null
          educadores_ids_prev: number[] | null
          educadores_nombrescortos_prev: string[] | null
          estado_establecimiento: string | null
          fecha_plan_sugerida: string | null
          fecha_prev: string | null
          grupo: string | null
          honorarios_kgs_prev: number | null
          honorarios_pesos_prev: number | null
          id_establecimiento: string | null
          id_servicio: string | null
          kms_presup_prev: number | null
          nombre_establecimiento: string | null
          origen: string | null
          servicio_prev: string | null
        }
        Relationships: []
      }
      v_presupuesto_completo: {
        Row: {
          busqueda_texto: string | null
          cantidad_cuotas: number | null
          cantidad_empresas: number | null
          cantidad_lineas: number | null
          cotizacion_al_emitir: number | null
          created_at: string | null
          created_by: string | null
          cuotas_cobradas: number | null
          cuotas_facturadas: number | null
          cuotas_pendientes_cobro: number | null
          cuotas_pendientes_email: number | null
          cuotas_requieren_facturacion: number | null
          email_enviado_a: string | null
          email_enviado_at: string | null
          empresa_cuit: number | null
          empresa_iva: Database["public"]["Enums"]["factura"] | null
          empresa_nombre: string | null
          empresas_facturacion: string[] | null
          es_borrador: boolean | null
          es_multi_empresa: boolean | null
          es_sin_cargo: boolean | null
          esquema_nombre: string | null
          esquema_periodicidad:
            | Database["public"]["Enums"]["periodicidad_facturacion"]
            | null
          esquema_tipo:
            | Database["public"]["Enums"]["tipo_esquema_facturacion"]
            | null
          establecimiento_ev: number | null
          establecimiento_litros_dia: number | null
          establecimiento_localidad: string | null
          establecimiento_nombre: string | null
          estado: Database["public"]["Enums"]["estado_presupuesto_nuevo"] | null
          estado_facturacion: string | null
          estado_presupuesto_agenda: number | null
          estado_presupuesto_descripcion: string | null
          estado_trabajo: number | null
          estado_trabajo_descripcion: string | null
          fecha_aceptacion: string | null
          fecha_emision: string | null
          fecha_envio: string | null
          fecha_rechazo: string | null
          fecha_servicio: string | null
          fecha_vencimiento: string | null
          id: string | null
          id_empresa: string | null
          id_esquema_facturacion: string | null
          id_establecimiento: string | null
          id_plantilla: string | null
          motivo_rechazo: string | null
          notas_internas: string | null
          numero: string | null
          observaciones: string | null
          pdf_generado_at: string | null
          pdf_storage_path: string | null
          plantilla_nombre: string | null
          porcentaje_cobrado: number | null
          porcentaje_facturado: number | null
          requiere_avance_presupuesto: boolean | null
          requiere_cobro: boolean | null
          requiere_envio_email: boolean | null
          requiere_facturacion: boolean | null
          servicio_grupo: string | null
          servicio_nombre: string | null
          sin_honorarios: boolean | null
          total: number | null
          total_cobrado_pesos: number | null
          total_cobrado_unidades: number | null
          total_facturado_pesos: number | null
          total_facturado_unidades: number | null
          total_honorarios: number | null
          total_movilidad: number | null
          total_otros: number | null
          total_presupuestado_pesos: number | null
          total_presupuestado_unidades: number | null
          unidad_cotizacion: string | null
          unidad_monto: string | null
          updated_at: string | null
          variacion_cotizacion_pct: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_presupuesto_plantilla"
            columns: ["id_plantilla"]
            isOneToOne: false
            referencedRelation: "plantilla_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas_con_establecimiento"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_con_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_configuracion_facturacion"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "v_empresas_establecimientos"
            referencedColumns: ["id_empresa"]
          },
          {
            foreignKeyName: "presupuesto_id_esquema_facturacion_fkey"
            columns: ["id_esquema_facturacion"]
            isOneToOne: false
            referencedRelation: "esquema_facturacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "presupuesto_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
      v_presupuestos_pendientes_reenvio: {
        Row: {
          cantidad_contactos: number | null
          contactos_disponibles: string[] | null
          email_enviado_at: string | null
          emails_disponibles: string[] | null
          enviado_a_tecnicos: string | null
          estado: Database["public"]["Enums"]["estado_presupuesto_nuevo"] | null
          fecha_emision: string | null
          id_establecimiento: string | null
          id_presupuesto: string | null
          nombre_establecimiento: string | null
          numero: string | null
          tecnico_responsable: string | null
        }
        Relationships: []
      }
      v_rendiciones_pendientes_aprobacion: {
        Row: {
          alerta_educadores: boolean | null
          alerta_sin_detalles: boolean | null
          alerta_sin_movilidad: boolean | null
          cantidad_gastos: number | null
          comentarios: string | null
          diferencias_educadores: boolean | null
          educadores_efectivos: Json | null
          educadores_efectivos_nombres: string | null
          educadores_programados_nombres: string | null
          estado_trabajo_actual: number | null
          fecha_servicio: string | null
          gastos_asociados_preview: Json | null
          gfotos_shareable_url: string | null
          horas_desde_rendicion: number | null
          id: number | null
          id_servicio: string | null
          localidad: string | null
          monto_movilidad_estimado: number | null
          nombre_establecimiento: string | null
          rendido_at: string | null
          rendido_by: number | null
          rendido_by_nombre: string | null
          resumen_impacto: Json | null
          servicio: string | null
          total_kms_efectivos: number | null
          total_monto_gastos: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rendicion_rendido_by"
            columns: ["rendido_by"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "agenda"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "agenda_con_nombres_educadores"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "servicios_moneda_constante"
            referencedColumns: ["id_servicio"]
          },
          {
            foreignKeyName: "fk_rendicion_servicio"
            columns: ["id_servicio"]
            isOneToOne: true
            referencedRelation: "v_servicios_para_rendir"
            referencedColumns: ["id_servicio"]
          },
        ]
      }
      v_resumen_liquidacion_pendiente: {
        Row: {
          alto_kilometraje: boolean | null
          educadores_afectados: number | null
          muy_atrasado: boolean | null
          periodo: string | null
          periodo_vencido: boolean | null
          tipos_incluidos: string | null
          tipos_movilidad: number | null
          total_kms_periodo: number | null
          total_monto_a_liquidar: number | null
          total_registros: number | null
        }
        Relationships: []
      }
      v_ruuts_cron_history: {
        Row: {
          command: string | null
          database: string | null
          duracion_segundos: number | null
          fin_local: string | null
          inicio_local: string | null
          job_pid: number | null
          jobname: string | null
          return_message: string | null
          runid: number | null
          status: string | null
          username: string | null
        }
        Relationships: []
      }
      v_ruuts_establecimientos_huerfanos: {
        Row: {
          estado: string | null
          farm_id: string | null
          internal_status_ruuts: string | null
          nombre_ruuts: string | null
          ultima_vez_detectado: string | null
        }
        Relationships: []
      }
      v_ruuts_staging_status: {
        Row: {
          estado: string | null
          minutos_desde_ultimo_insert: number | null
          primer_insert: string | null
          registros_pendientes: number | null
          ultimo_insert: string | null
        }
        Relationships: []
      }
      v_ruuts_sync_resumen: {
        Row: {
          actualizados: number | null
          en_blacklist: number | null
          errores: number | null
          no_encontrados: number | null
          sin_cambios: number | null
          sync_batch_id: string | null
          sync_timestamp: string | null
          total_procesados: number | null
        }
        Relationships: []
      }
      v_ruuts_sync_ultimo_detalle: {
        Row: {
          cambios_aplicados: Json | null
          farm_id: string | null
          id_establecimiento: string | null
          mensaje: string | null
          nombre_perennia: string | null
          nombre_ruuts: string | null
          sync_timestamp: string | null
          tipo: string | null
        }
        Relationships: []
      }
      v_servicios_para_rendir: {
        Row: {
          comentarios: string | null
          diferencias_educadores: boolean | null
          educadores: number[] | null
          educadores_efectivos: Json | null
          educadores_programados: Json | null
          estado_rendicion:
            | Database["public"]["Enums"]["estado_rendicion"]
            | null
          estado_trabajo: number | null
          fecha: string | null
          fecha_fin_servicio: string | null
          fue_rechazado: boolean | null
          gastos_creados: Json | null
          gastos_preview: Json | null
          gfotos_shareable_url: string | null
          id_servicio: string | null
          mensaje_diferencias: string | null
          motivo_rechazo: string | null
          nombre_establecimiento: string | null
          pendiente_aprobacion: boolean | null
          puede_editar: boolean | null
          rendicion_created_at: string | null
          rendido_at: string | null
          servicio: string | null
          total_kms_efectivos: number | null
          valor_km_servicio: number | null
          ya_aprobado: boolean | null
        }
        Relationships: []
      }
      v_solicitudes_factura_pendientes: {
        Row: {
          cotizacion_usada: number | null
          created_at: string | null
          cuota_fecha_programada: string | null
          cuota_porcentaje: number | null
          empresa_cuit: number | null
          empresa_iva: Database["public"]["Enums"]["factura"] | null
          empresa_nombre: string | null
          estado: string | null
          id: string | null
          id_cuota: string | null
          id_empresa: string | null
          id_presupuesto: string | null
          id_tecnico_asignado: number | null
          iva_estimado: number | null
          monto_honorarios_pesos: number | null
          monto_honorarios_unidades: number | null
          monto_movilidad_pesos: number | null
          monto_total_estimado: number | null
          motivo_sugerencia: string | null
          nombre_establecimiento: string | null
          numero_cuota: number | null
          numero_presupuesto: string | null
          presupuesto_unidad: string | null
          quien_factura_sugerido: string | null
          tecnico_afip_habilitado: boolean | null
          tecnico_asignado_nombre: string | null
          tipo_factura_sugerido: string | null
          total_con_iva_estimado: number | null
          total_cuotas: number | null
          trigger_cumplido: boolean | null
          trigger_habilitacion: Json | null
          unidad_cotizacion: string | null
          warnings: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_factura_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "cuota_presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_cuota_fkey"
            columns: ["id_cuota"]
            isOneToOne: false
            referencedRelation: "v_cuotas_pendientes"
            referencedColumns: ["id_cuota"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "presupuesto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_comparacion_precios_presupuesto"
            referencedColumns: ["presupuesto_id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_desvio_dias_presupuesto"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuesto_completo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_factura_id_presupuesto_fkey"
            columns: ["id_presupuesto"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_presupuesto"]
          },
          {
            foreignKeyName: "solicitud_factura_id_tecnico_asignado_fkey"
            columns: ["id_tecnico_asignado"]
            isOneToOne: false
            referencedRelation: "educadores"
            referencedColumns: ["id_educador"]
          },
        ]
      }
      vw_facturacion_estab_base: {
        Row: {
          dias_servicio: number | null
          fecha: string | null
          grupo_agenda: Database["public"]["Enums"]["Grupos"] | null
          grupo_establecimiento: string | null
          ha_ganaderia_estimada: number | null
          id_establecimiento: string | null
          kgs_novillo_servicio: number | null
          nombre_establecimiento: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "establecimientos"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_establecimiento_detalle"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_facturacion_establecimiento"
            referencedColumns: ["id_establecimiento"]
          },
          {
            foreignKeyName: "agenda_id_establecimiento_fkey"
            columns: ["id_establecimiento"]
            isOneToOne: false
            referencedRelation: "v_presupuestos_pendientes_reenvio"
            referencedColumns: ["id_establecimiento"]
          },
        ]
      }
    }
    Functions: {
      actualizar_actividades_establecimiento: {
        Args: { p_id_establecimiento: string; p_sobrescribir?: boolean }
        Returns: Json
      }
      actualizar_actividades_todos_establecimientos: {
        Args: { p_solo_sin_actividad?: boolean }
        Returns: Json
      }
      add_to_ruuts_blacklist: {
        Args: {
          p_created_by?: string
          p_farm_id: string
          p_motivo: string
          p_nombre: string
        }
        Returns: undefined
      }
      ajustar_movilidad_presupuesto: {
        Args: {
          p_costo_km: number
          p_id_presupuesto: string
          p_nuevos_kms: number
        }
        Returns: undefined
      }
      anular_factura_no_emitida: {
        Args: {
          p_id_factura: number
          p_motivo?: string
          p_tabla_factura: string
        }
        Returns: undefined
      }
      aprobar_rendicion: {
        Args: { p_approved_by: number; p_id_servicio: string }
        Returns: Json
      }
      aprobar_solicitud_factura: {
        Args: {
          p_aprobado_por?: number
          p_emitir_afip?: boolean
          p_id_solicitud: string
          p_id_tecnico?: number
          p_quien_factura: string
        }
        Returns: number
      }
      bloquear_clasificacion_manual: {
        Args: {
          p_bloqueada_by: number
          p_id_establecimiento: string
          p_nuevo_tipo: Database["public"]["Enums"]["tipo_candidato_enum"]
        }
        Returns: undefined
      }
      calcular_cotizacion_con_mes_referencia: {
        Args: { p_fecha: string; p_unidad: string }
        Returns: Json
      }
      calcular_cotizacion_mes_anterior: {
        Args: { p_fecha: string; p_unidad: string }
        Returns: number
      }
      calcular_honorarios: {
        Args: { p_id: string; p_manual: boolean }
        Returns: undefined
      }
      calcular_precio_dia_tecnico: {
        Args: { p_actividad: string; p_ev?: number; p_litros_dia?: number }
        Returns: Json
      }
      clasificar_tipo_candidato:
        | {
            Args: { p_id_establecimiento: string }
            Returns: Database["public"]["Enums"]["tipo_candidato_enum"]
          }
        | {
            Args: {
              p_ha_elegibles: number
              p_id_establecimiento: string
              p_tiene_grass: boolean
            }
            Returns: Database["public"]["Enums"]["tipo_candidato_enum"]
          }
      clear_ruuts_staging: { Args: never; Returns: string }
      crear_notificacion: {
        Args: {
          p_actor_id?: number
          p_entidad_id?: string
          p_entidad_tipo?: string
          p_id_educador: number
          p_mensaje?: string
          p_metadata?: Json
          p_tipo: Database["public"]["Enums"]["tipo_notificacion"]
          p_titulo: string
          p_url?: string
        }
        Returns: string
      }
      crear_notificaciones_mencion: {
        Args: {
          p_actor_id: number
          p_contexto_id: string
          p_contexto_tipo: string
          p_mencionados: number[]
          p_titulo: string
          p_url: string
        }
        Returns: undefined
      }
      crear_snapshots_cuotas_pendientes: {
        Args: { p_id_presupuesto: string }
        Returns: number
      }
      crear_solicitud_factura_cuota: {
        Args: { p_id_cuota: string }
        Returns: string
      }
      crear_solicitudes_cuotas_vencidas: { Args: never; Returns: number }
      cron_check_gdrive_integrity: { Args: never; Returns: Json }
      cron_notif_eventos_sin_asistencia: {
        Args: { p_id_responsable?: number }
        Returns: number
      }
      cron_notif_presupuestos_sin_respuesta: { Args: never; Returns: undefined }
      cron_notif_servicio_proximo: { Args: never; Returns: undefined }
      cron_notif_servicios_pendientes: { Args: never; Returns: undefined }
      cron_notif_tareas_vencidas: { Args: never; Returns: undefined }
      cron_notify_promedios_mensuales: { Args: never; Returns: Json }
      cron_ruuts_auto_sync: { Args: never; Returns: undefined }
      cron_sync_dolar: { Args: never; Returns: Json }
      cron_sync_gdrive_structure: { Args: never; Returns: Json }
      cron_sync_inmag_arrendamiento: { Args: never; Returns: Json }
      cron_sync_siglea: { Args: never; Returns: Json }
      cron_sync_uva: { Args: never; Returns: Json }
      crosstab: { Args: { "": string }; Returns: Record<string, unknown>[] }
      crosstab2: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_2"][]
        SetofOptions: {
          from: "*"
          to: "tablefunc_crosstab_2"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      crosstab3: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_3"][]
        SetofOptions: {
          from: "*"
          to: "tablefunc_crosstab_3"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      crosstab4: {
        Args: { "": string }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_4"][]
        SetofOptions: {
          from: "*"
          to: "tablefunc_crosstab_4"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      desbloquear_clasificacion: {
        Args: { p_id_establecimiento: string }
        Returns: undefined
      }
      distribuir_cuotas_multiempresa: {
        Args: { p_id_presupuesto: string; p_porcentajes?: Json }
        Returns: number
      }
      editar_monto_cuota: {
        Args: { p_cuota_id: string; p_nuevo_monto_pesos: number }
        Returns: Json
      }
      editar_movilidad_cuota: {
        Args: { p_costo_km?: number; p_cuota_id: string; p_kms: number }
        Returns: undefined
      }
      estimar_kms_establecimiento: {
        Args: { p_id_educador?: number; p_id_establecimiento: string }
        Returns: {
          confianza: string
          detalle: Json
          kms_estimados: number
          origen: string
        }[]
      }
      evaluar_trigger_cuota: { Args: { p_id_cuota: string }; Returns: boolean }
      evaluar_y_crear_solicitudes_cuota: {
        Args: { p_id_presupuesto: string }
        Returns: number
      }
      f_aprobar_movilidad_batch: {
        Args: { p_approved_by: number; p_ids: number[] }
        Returns: Json
      }
      f_cc_mov: {
        Args: {
          p_descripcion: string
          p_fecha: string
          p_id_educador: number
          p_id_origen: string
          p_monto: number
          p_tipo: string
        }
        Returns: undefined
      }
      f_create_factura_tecnico: {
        Args: {
          p_categoria: string
          p_descripcion_gasto?: string
          p_es_reembolsable?: boolean
          p_fecha: string
          p_id_educador: number
          p_id_gasto: number
          p_monto_total: number
        }
        Returns: undefined
      }
      f_es_reemb: { Args: { categoria: string }; Returns: boolean }
      f_fiscal_tag: {
        Args: {
          p_metodo: Database["public"]["Enums"]["metodo_pago"]
          p_reemb: boolean
          p_tipo: Database["public"]["Enums"]["tipo_factura"]
        }
        Returns: string
      }
      f_gasto_cerrado: {
        Args: { g: Database["public"]["Tables"]["gastos_rendidos"]["Row"] }
        Returns: undefined
      }
      f_generar_descripcion_factura: {
        Args: {
          p_categoria: string
          p_descripcion_gasto?: string
          p_fecha?: string
          p_monto?: number
          p_tipo_factura?: string
        }
        Returns: string
      }
      f_generate_validation_report: { Args: never; Returns: string }
      f_get_valor_km_referencia: { Args: { p_fecha?: string }; Returns: number }
      f_run_integration_tests: {
        Args: never
        Returns: {
          details: string
          status: string
          test_name: string
          test_time: string
        }[]
      }
      f_test_functional_workflow: { Args: never; Returns: string }
      fn_ejecutar_validacion_integridad_discord: {
        Args: never
        Returns: undefined
      }
      fn_limpiar_reversos_huerfanos_facturas: {
        Args: { p_dry_run?: boolean }
        Returns: {
          accion: string
          cc_id: number
          descripcion: string
          id_educador: number
          monto: number
        }[]
      }
      fn_sync_dolar_oficial: {
        Args: { p_json: Json }
        Returns: {
          registros_actualizados: number
          registros_insertados: number
          registros_procesados: number
          ultima_cotizacion: number
          ultima_fecha: string
        }[]
      }
      fn_sync_inmag_arrendamiento: {
        Args: { p_fecha: string; p_valor: number }
        Returns: {
          accion: string
          mensaje: string
          success: boolean
        }[]
      }
      fn_sync_siglea: {
        Args: { p_fecha: string; p_valor: number }
        Returns: {
          accion: string
          mensaje: string
          success: boolean
        }[]
      }
      fn_sync_uva: {
        Args: { p_json: Json }
        Returns: {
          registros_actualizados: number
          registros_insertados: number
          registros_procesados: number
          ultima_fecha: string
          ultimo_valor: number
        }[]
      }
      fn_validar_balance_facturas_cc: {
        Args: never
        Returns: {
          detalle: string
          diferencia: number
          tipo_validacion: string
        }[]
      }
      fn_validar_integridad_completa: {
        Args: never
        Returns: {
          detalle: string
          diferencia: number
          tipo_validacion: string
        }[]
      }
      fn_validar_integridad_honorarios_fijos: {
        Args: never
        Returns: {
          diferencia: number
          estado: string
          id_educador: number
          periodo: string
          suma_cc: number
          suma_honorarios: number
        }[]
      }
      fn_validar_integridad_honorarios_por_hora: {
        Args: never
        Returns: {
          diferencia: number
          estado: string
          id_educador: number
          periodo: string
          suma_cc: number
          suma_honorarios: number
        }[]
      }
      fn_validar_integridad_honorarios_proyecto: {
        Args: never
        Returns: {
          diferencia: number
          estado: string
          id_educador: number
          suma_cc: number
          suma_honorarios: number
        }[]
      }
      fn_validar_integridad_honorarios_tecnicos: {
        Args: never
        Returns: {
          diferencia: number
          estado: string
          estado_trabajo: number
          id_educador: number
          id_servicio: string
          monto_en_cc: number
          monto_esperado: number
          servicio: string
        }[]
      }
      fn_validar_reversos_huerfanos_facturas: {
        Args: never
        Returns: {
          detalle: string
          diferencia: number
          tipo_validacion: string
        }[]
      }
      fusionar_cuotas: {
        Args: { p_cuota_ids: string[]; p_notas?: string }
        Returns: string
      }
      generar_cuotas_presupuesto: {
        Args: { p_id_presupuesto: string }
        Returns: number
      }
      generar_numero_presupuesto: { Args: never; Returns: string }
      get_comparacion_precio_presupuesto: {
        Args: { p_presupuesto_id: string }
        Returns: {
          alerta_descuento: string
          alerta_precio: string
          descuento_actual_pct: number
          descuento_historico_pct: number
          diferencia_vs_historico_pct: number
          presupuesto_id: string
          presupuesto_numero: string
          servicios_historicos: number
          tipo_normalizado: string
          tipo_servicio: string
          unidad_precio: string
          unidades_por_dia_actual: number
          unidades_por_dia_historico: number
        }[]
      }
      get_educadores_tecnicos_ordenados: {
        Args: never
        Returns: {
          grupo: string
          id_educador: number
          nombre_educador: string
          nombrecorto: string
          seniority: string
          uso_reciente: number
        }[]
      }
      get_evento_emails: { Args: { evento_id: number }; Returns: string[] }
      get_evento_emails_array: {
        Args: { p_evento_id: number }
        Returns: string[]
      }
      get_kpis_facturacion: { Args: never; Returns: Json }
      get_kpis_facturas_perennia: { Args: never; Returns: Json }
      get_kpis_mis_honorarios: {
        Args: {
          p_fecha_desde: string
          p_fecha_hasta: string
          p_id_educador: number
        }
        Returns: Json
      }
      get_ruuts_sync_detail: {
        Args: { p_batch_id: string }
        Returns: {
          cambios_aplicados: Json
          farm_id: string
          fecha: string
          id_establecimiento: string
          mensaje: string
          nombre_perennia: string
          nombre_ruuts: string
          tipo: string
        }[]
      }
      get_servicios_con_educadores: {
        Args: { limite?: number }
        Returns: {
          created_at: string
          dias_campo: number
          dias_gabinete: number
          educadores: number[]
          estado_presupuesto: number
          estado_rendicion: string
          estado_trabajo: number
          fecha: string
          fecha_envio_informe: string
          fecha_fin_servicio: string
          gfotos_album_url: string
          grupo: string
          id_establecimiento: string
          id_linea_presupuesto: string
          id_presupuesto_nuevo: string
          id_servicio: string
          kms_presupuestados: number
          link_informe_drive: string
          localidad: string
          nombre_establecimiento: string
          nombres_educadores: string[]
          numero_visita: number
          servicio: string
        }[]
      }
      get_servicios_educador: {
        Args: { p_educador_id: number }
        Returns: {
          educadores: number[]
          estado_trabajo: number
          fecha: string
          fecha_fin: string
          id_establecimiento: string
          id_servicio: string
          nombre_establecimiento: string
          servicio: string
        }[]
      }
      get_tecnicos_ordenados_por_facturas: {
        Args: never
        Returns: {
          alias: string
          id_educador: number
          nombrecorto: string
        }[]
      }
      get_vault_secret: { Args: { p_name: string }; Returns: string }
      importar_tipo_cambio: { Args: never; Returns: undefined }
      inferir_actividades_desde_planificacion: {
        Args: { p_id_establecimiento: string }
        Returns: {
          actividad_principal: Database["public"]["Enums"]["actividad_principal"]
          actividades: Database["public"]["Enums"]["actividad_principal"][]
          ev_por_subactividad: Json
          subactividad_principal: Database["public"]["Enums"]["subactividad_ganadera"]
          subactividades_ganaderas: Database["public"]["Enums"]["subactividad_ganadera"][]
          tipos_encontrados: string[]
        }[]
      }
      liquidar_movilidad_eventos: {
        Args: { p_id_educador?: number; p_periodo?: string }
        Returns: {
          monto_total: number
          registros_liquidados: number
        }[]
      }
      liquidar_movilidad_periodo:
        | { Args: { p_educador?: number; p_periodo: string }; Returns: Json }
        | {
            Args: {
              p_educador?: number
              p_periodo: string
              p_valor_km_manual?: number
            }
            Returns: Json
          }
      log_trigger: {
        Args: {
          p_detail?: Json
          p_op: string
          p_row_id: string
          p_table: string
          p_trigger: string
        }
        Returns: undefined
      }
      map_ruuts_internal_status: {
        Args: { ruuts_status: string }
        Returns: string
      }
      mapear_codigo_plantilla:
        | { Args: { p_id_tipo_servicio: number }; Returns: string }
        | { Args: { p_servicio: string }; Returns: string }
      mass_update_establecimientos: { Args: never; Returns: undefined }
      migrar_vinculacion_historica: {
        Args: never
        Returns: {
          detalles: Json
          inconsistencias: number
          procesados: number
          sin_vinculacion: number
          vinculados: number
        }[]
      }
      normalizar_telefono_ar: { Args: { tel: string }; Returns: string }
      notificar_servicios_sin_album: {
        Args: { p_id_educador?: number }
        Returns: number
      }
      obtener_configuracion: { Args: { p_clave: string }; Returns: Json }
      obtener_configuracion_numero: {
        Args: { p_clave: string }
        Returns: number
      }
      obtener_costo_km_vigente: { Args: never; Returns: number }
      obtener_datos_ajuste_kms: {
        Args: { p_id_presupuesto: string }
        Returns: Json
      }
      posicion_cuota_activa: {
        Args: { p_id_presupuesto: string; p_numero_cuota: number }
        Returns: number
      }
      preview_email_factura: {
        Args: { p_id_factura: number; p_tabla_factura?: string }
        Returns: Json
      }
      preview_factura_cuota: {
        Args: { p_id_cuota: string; p_tipo_emisor?: string }
        Returns: Json
      }
      procesar_rendicion_completa: {
        Args: {
          p_comentarios?: string
          p_educadores_efectivos: Json
          p_gastos_nuevos?: Json
          p_id_servicio: string
          p_usuario?: number
        }
        Returns: Json
      }
      recalcular_solicitudes_pendientes_por_cotizacion: {
        Args: { p_fecha_actualizada: string; p_unidad_cotizacion: string }
        Returns: {
          detalle: Json
          solicitudes_actualizadas: number
        }[]
      }
      rechazar_rendicion: {
        Args: {
          p_id_servicio: string
          p_motivo_rechazo: string
          p_rechazado_by: number
        }
        Returns: Json
      }
      rechazar_rendicion_servicio: {
        Args: {
          p_id_servicio: string
          p_motivo_rechazo: string
          p_rechazado_by?: number
        }
        Returns: Json
      }
      rechazar_solicitud_factura: {
        Args: {
          p_id_solicitud: string
          p_motivo: string
          p_rechazado_por?: number
        }
        Returns: undefined
      }
      redistribuir_cuotas_pendientes: {
        Args: { p_id_presupuesto: string; p_nuevos_porcentajes: number[] }
        Returns: number
      }
      refresh_evento_con_emails: { Args: never; Returns: undefined }
      registrar_factura_externa:
        | {
            Args: {
              p_cae?: string
              p_cae_vencimiento?: string
              p_descripcion?: string
              p_fecha: string
              p_id_cuota?: string
              p_id_distribucion?: string
              p_id_empresa: string
              p_id_servicio?: number
              p_monto_iva?: number
              p_monto_neto: number
              p_monto_nogravado?: number
              p_nro_factura: string
              p_tipo_factura: string
            }
            Returns: number
          }
        | {
            Args: {
              p_cae?: string
              p_cae_vencimiento?: string
              p_descripcion?: string
              p_fecha: string
              p_id_cuota?: string
              p_id_distribucion?: string
              p_id_empresa: string
              p_id_servicio?: string
              p_monto_iva: number
              p_monto_neto: number
              p_monto_nogravado?: number
              p_nro_factura: string
              p_tipo_factura: string
            }
            Returns: number
          }
        | {
            Args: {
              p_cae?: string
              p_cae_vencimiento?: string
              p_descripcion?: string
              p_fecha: string
              p_id_cuota?: string
              p_id_distribucion?: string
              p_id_empresa: string
              p_id_servicio?: string
              p_monto_iva: number
              p_monto_neto: number
              p_monto_nogravado?: number
              p_nro_factura: string
              p_tipo_factura: Database["public"]["Enums"]["tipo_factura"]
            }
            Returns: number
          }
      reparar_inconsistencias_movilidad: {
        Args: { p_admin_user_id?: number; p_dry_run?: boolean }
        Returns: {
          accion: string
          cuenta_corriente_id: number
          detalles: Json
          movilidad_id: number
          resultado: string
        }[]
      }
      reparto_porcentajes: { Args: { cats: string[] }; Returns: number[] }
      rpc_regenerar_cuotas: {
        Args: { p_id_presupuesto: string }
        Returns: number
      }
      ruuts_auto_sync_toggle: { Args: { p_enabled: boolean }; Returns: string }
      search_educador_fuzzy: {
        Args: { max_distance?: number; search_term: string }
        Returns: {
          alias: string
          distance: number
          id_educador: number
          match_type: string
          nombre_educador: string
          nombrecorto: string
        }[]
      }
      soft_delete_evento: {
        Args: { deleted_by_user: number; evento_id: number }
        Returns: boolean
      }
      sugerir_actividad_facturacion: {
        Args: { p_id_establecimiento: string; p_tipo_servicio?: string }
        Returns: string
      }
      sugerir_facturacion_cuota: { Args: { p_id_cuota: string }; Returns: Json }
      sugerir_facturacion_cuotas_batch: {
        Args: { p_id_presupuesto: string }
        Returns: {
          id_cuota: string
          id_tecnico: number
          motivo: string
          quien_factura: string
          tecnico_nombre: string
          tipo_factura: string
        }[]
      }
      sugerir_quien_factura: {
        Args: { p_id_empresa: string; p_id_servicio?: string }
        Returns: Json
      }
      sync_presupuesto_total_final: {
        Args: { p_id: string }
        Returns: undefined
      }
      sync_ruuts_screening_data: {
        Args: { p_imported_by?: string }
        Returns: {
          actualizados: number
          batch_id: string
          en_blacklist: number
          errores: number
          no_encontrados: number
          sin_cambios: number
          total: number
        }[]
      }
      test_migracion_datos_historicos: {
        Args: never
        Returns: {
          antes_total: number
          antes_vinculados: number
          despues_total: number
          despues_vinculados: number
          test_name: string
          test_passed: boolean
          vinculaciones_creadas: number
        }[]
      }
      test_performance_vistas: {
        Args: never
        Returns: {
          execution_time: unknown
          performance_rating: string
          record_count: number
          vista_name: string
        }[]
      }
      test_vinculacion_bidireccional_completa: {
        Args: never
        Returns: {
          details: string
          execution_time: unknown
          passed: boolean
          test_name: string
          test_number: number
        }[]
      }
      tiene_plan_pastoreo: {
        Args: { p_id_establecimiento: string }
        Returns: boolean
      }
      toggle_sin_cargo_presupuesto: {
        Args: { p_presupuesto_id: string; p_sin_cargo: boolean }
        Returns: undefined
      }
      update_establecimiento_estado: {
        Args: { p_establecimiento_id: string }
        Returns: undefined
      }
      update_evento_google_data: {
        Args: { evento_id: number; google_event_id: string; meet_url?: string }
        Returns: undefined
      }
      update_gantt_view: { Args: never; Returns: undefined }
      update_lb_eov: {
        Args: { p_establecimiento_id: string }
        Returns: undefined
      }
      validar_integridad_movilidad_cc: {
        Args: never
        Returns: {
          cuenta_corriente_id: number
          descripcion: string
          diferencia: number
          monto_cuenta_corriente: number
          monto_movilidad: number
          movilidad_id: number
          severidad: string
          tipo_inconsistencia: string
        }[]
      }
      verificacion_implementacion_completa: {
        Args: never
        Returns: {
          componente: string
          detalles: string
          estado: string
        }[]
      }
    }
    Enums: {
      actividad_principal: "Ganadería" | "Tambo" | "Agricultura"
      Actividades: "Tambo" | "Ganadería" | "Agricultura"
      canal_preferido_contacto: "indistinto" | "whatsapp" | "email"
      categorias_comprobante:
        | "Combustible"
        | "Comida Servicios"
        | "Hotel Servicios"
        | "Bienes de Uso"
        | "Comprobante Regalado"
        | "Eventos Perennia"
        | "Fletes Muestras"
        | "Servicios Contratados"
        | "Adelanto Honorarios"
        | "Otro"
        | "Mantenimiento Vehículo"
        | "Indumentaria"
        | "Equipamiento"
        | "Materiales Oficina"
        | "Adelanto Movilidad"
      enum_establecimiento_grupo:
        | "Algarrobo"
        | "Paspalum"
        | "Sureños"
        | "Sin Grupo"
      Estado:
        | "Interesado"
        | "Diagnósticado"
        | "Activo"
        | "Activo Previo"
        | "Activo Convenio"
        | "solo EOV"
        | "Baja"
        | "Derivado Ovis Central"
        | "Equipo"
      estado_comercial_perennia:
        | "1. Candidato"
        | "2. Pendiente Ruuts"
        | "3. Pendiente Presupuesto"
        | "4. Aguardando Respuesta Presu"
        | "5. En proceso de Firma"
        | "6. Descartado"
      estado_cuota:
        | "pendiente"
        | "programada"
        | "facturada"
        | "cobrada"
        | "cancelada"
        | "fusionada"
      estado_factura_tecnico:
        | "borrador"
        | "solicitada"
        | "emitida"
        | "enviada"
        | "cobrada"
        | "subida"
        | "anulada"
      estado_gasto_tecnico:
        | "borrador"
        | "pendiente_autorizacion"
        | "cerrado"
        | "cerrado_rechazado"
      estado_movilidad: "pendiente" | "aprobado" | "liquidado" | "rechazado"
      estado_presupuesto_nuevo:
        | "borrador"
        | "pendiente_aprobacion"
        | "enviado"
        | "aceptado"
        | "rechazado"
        | "vencido"
        | "cancelado"
        | "archivado"
      estado_rendicion:
        | "borrador"
        | "rendido"
        | "aprobado"
        | "rechazado"
        | "cerrado"
      estado_tecnico: "Activo" | "Inactivo"
      factura: "A" | "C" | "Sin Factura" | "B" | "E" | "NC_A" | "NC_B" | "NC_C"
      Grupos: "Algarrobo" | "Paspalum" | "Sureños" | "Sin Grupo"
      metodo_pago:
        | "Plata del Técnico"
        | "Tarjeta Crédito Galicia"
        | "Galicia Perennia"
        | "Brubank Perennia"
        | "LB Finanzas"
        | "Otro"
      monitoring_report: "MR1" | "MR2" | "MR3" | "MR4" | "MR5" | "MR6" | "MR7"
      origen_gasto: "kapso" | "jetadmin" | "web"
      periodicidad_facturacion:
        | "mensual"
        | "bimestral"
        | "trimestral"
        | "semestral"
        | "anual"
      rol_contacto_establecimiento:
        | "Productor"
        | "Encargado"
        | "Administrativo"
        | "Tecnico"
        | "Sponsor"
        | "Asesor Técnico"
      rol_educador: "admin" | "lider" | "tecnico"
      seniority: "Practicante" | "Junior" | "Especialista" | "Líder"
      servicio_agrupado:
        | "Contexto"
        | "Contexto + Plan"
        | "Diagnóstico Ganaderia"
        | "Linea Base"
        | "MLP"
        | "MCP"
        | "Plan Cerrado"
        | "Plan Abierto"
        | "MCP + Plan"
        | "Visita Ganadera"
        | "Visita Agricultura"
        | "Agricultura"
        | "Otros"
        | "Plan de la Tierra"
        | "Plan Financiero"
        | "DI + Plan"
        | "DI Agricultura"
        | "Linea Base + Plan"
        | "Plan de Pastoreo"
        | "Gestion + Sistematizacion"
        | "Plan Pastoreo + MCP"
        | "Plan Accion CH"
        | "Diagnostico Tambo"
        | "DI Integral"
      subactividad_ganadera: "Cría" | "Engorde" | "Ciclo Completo" | "Recría"
      tipo_candidato_enum: "Inexplicable" | "GRASS+Carbono" | "Paquete completo"
      tipo_educador:
        | "educador"
        | "administracion"
        | "tecnologia"
        | "proveedores"
        | "marketing"
      tipo_esquema_facturacion:
        | "cuotas"
        | "periodico"
        | "paquete"
        | "unico"
        | "por_servicio"
      tipo_evento:
        | "evento_propio"
        | "capacitacion"
        | "charla"
        | "visita_comercial"
        | "proyecto"
        | "reunion"
        | "otro"
        | "reunion_comercial"
        | "reunion_interna"
        | "reunion_cliente"
      tipo_factura: "A" | "B" | "C" | "Ticket" | "Sin comprobante"
      tipo_movilidad:
        | "servicio"
        | "evento_propio"
        | "capacitacion"
        | "charla"
        | "visita_comercial"
        | "proyecto"
        | "reunion"
        | "administrativo"
        | "otro"
      tipo_notificacion:
        | "tarea_asignada"
        | "tarea_mencion"
        | "tarea_comentario"
        | "tarea_vencida"
        | "tarea_proxima_vencer"
        | "tarea_estado_cambio"
        | "presupuesto_enviado"
        | "presupuesto_aceptado"
        | "presupuesto_rechazado"
        | "presupuesto_sin_respuesta"
        | "presupuesto_requiere_aprobacion"
        | "servicio_proximo"
        | "servicio_sin_rendicion"
        | "servicio_sin_informe"
        | "rendicion_aprobada"
        | "rendicion_rechazada"
        | "rendicion_pendiente_revision"
        | "mencion_comentario"
        | "sistema"
        | "factura_solicitada"
        | "factura_tecnico_subida"
        | "evento_sin_asistencia"
        | "gasto_pendiente_aprobacion"
        | "gasto_resuelto"
      tipodecontrato: "Fijo" | "Independiente"
      "Unidades de Facturacion": "Litros" | "Kgs" | "USD"
    }
    CompositeTypes: {
      tablefunc_crosstab_2: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
      }
      tablefunc_crosstab_3: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
      }
      tablefunc_crosstab_4: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
        category_4: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  datos_campo: {
    Enums: {},
  },
  public: {
    Enums: {
      actividad_principal: ["Ganadería", "Tambo", "Agricultura"],
      Actividades: ["Tambo", "Ganadería", "Agricultura"],
      canal_preferido_contacto: ["indistinto", "whatsapp", "email"],
      categorias_comprobante: [
        "Combustible",
        "Comida Servicios",
        "Hotel Servicios",
        "Bienes de Uso",
        "Comprobante Regalado",
        "Eventos Perennia",
        "Fletes Muestras",
        "Servicios Contratados",
        "Adelanto Honorarios",
        "Otro",
        "Mantenimiento Vehículo",
        "Indumentaria",
        "Equipamiento",
        "Materiales Oficina",
        "Adelanto Movilidad",
      ],
      enum_establecimiento_grupo: [
        "Algarrobo",
        "Paspalum",
        "Sureños",
        "Sin Grupo",
      ],
      Estado: [
        "Interesado",
        "Diagnósticado",
        "Activo",
        "Activo Previo",
        "Activo Convenio",
        "solo EOV",
        "Baja",
        "Derivado Ovis Central",
        "Equipo",
      ],
      estado_comercial_perennia: [
        "1. Candidato",
        "2. Pendiente Ruuts",
        "3. Pendiente Presupuesto",
        "4. Aguardando Respuesta Presu",
        "5. En proceso de Firma",
        "6. Descartado",
      ],
      estado_cuota: [
        "pendiente",
        "programada",
        "facturada",
        "cobrada",
        "cancelada",
        "fusionada",
      ],
      estado_factura_tecnico: [
        "borrador",
        "solicitada",
        "emitida",
        "enviada",
        "cobrada",
        "subida",
        "anulada",
      ],
      estado_gasto_tecnico: [
        "borrador",
        "pendiente_autorizacion",
        "cerrado",
        "cerrado_rechazado",
      ],
      estado_movilidad: ["pendiente", "aprobado", "liquidado", "rechazado"],
      estado_presupuesto_nuevo: [
        "borrador",
        "pendiente_aprobacion",
        "enviado",
        "aceptado",
        "rechazado",
        "vencido",
        "cancelado",
        "archivado",
      ],
      estado_rendicion: [
        "borrador",
        "rendido",
        "aprobado",
        "rechazado",
        "cerrado",
      ],
      estado_tecnico: ["Activo", "Inactivo"],
      factura: ["A", "C", "Sin Factura", "B", "E", "NC_A", "NC_B", "NC_C"],
      Grupos: ["Algarrobo", "Paspalum", "Sureños", "Sin Grupo"],
      metodo_pago: [
        "Plata del Técnico",
        "Tarjeta Crédito Galicia",
        "Galicia Perennia",
        "Brubank Perennia",
        "LB Finanzas",
        "Otro",
      ],
      monitoring_report: ["MR1", "MR2", "MR3", "MR4", "MR5", "MR6", "MR7"],
      origen_gasto: ["kapso", "jetadmin", "web"],
      periodicidad_facturacion: [
        "mensual",
        "bimestral",
        "trimestral",
        "semestral",
        "anual",
      ],
      rol_contacto_establecimiento: [
        "Productor",
        "Encargado",
        "Administrativo",
        "Tecnico",
        "Sponsor",
        "Asesor Técnico",
      ],
      rol_educador: ["admin", "lider", "tecnico"],
      seniority: ["Practicante", "Junior", "Especialista", "Líder"],
      servicio_agrupado: [
        "Contexto",
        "Contexto + Plan",
        "Diagnóstico Ganaderia",
        "Linea Base",
        "MLP",
        "MCP",
        "Plan Cerrado",
        "Plan Abierto",
        "MCP + Plan",
        "Visita Ganadera",
        "Visita Agricultura",
        "Agricultura",
        "Otros",
        "Plan de la Tierra",
        "Plan Financiero",
        "DI + Plan",
        "DI Agricultura",
        "Linea Base + Plan",
        "Plan de Pastoreo",
        "Gestion + Sistematizacion",
        "Plan Pastoreo + MCP",
        "Plan Accion CH",
        "Diagnostico Tambo",
        "DI Integral",
      ],
      subactividad_ganadera: ["Cría", "Engorde", "Ciclo Completo", "Recría"],
      tipo_candidato_enum: [
        "Inexplicable",
        "GRASS+Carbono",
        "Paquete completo",
      ],
      tipo_educador: [
        "educador",
        "administracion",
        "tecnologia",
        "proveedores",
        "marketing",
      ],
      tipo_esquema_facturacion: [
        "cuotas",
        "periodico",
        "paquete",
        "unico",
        "por_servicio",
      ],
      tipo_evento: [
        "evento_propio",
        "capacitacion",
        "charla",
        "visita_comercial",
        "proyecto",
        "reunion",
        "otro",
        "reunion_comercial",
        "reunion_interna",
        "reunion_cliente",
      ],
      tipo_factura: ["A", "B", "C", "Ticket", "Sin comprobante"],
      tipo_movilidad: [
        "servicio",
        "evento_propio",
        "capacitacion",
        "charla",
        "visita_comercial",
        "proyecto",
        "reunion",
        "administrativo",
        "otro",
      ],
      tipo_notificacion: [
        "tarea_asignada",
        "tarea_mencion",
        "tarea_comentario",
        "tarea_vencida",
        "tarea_proxima_vencer",
        "tarea_estado_cambio",
        "presupuesto_enviado",
        "presupuesto_aceptado",
        "presupuesto_rechazado",
        "presupuesto_sin_respuesta",
        "presupuesto_requiere_aprobacion",
        "servicio_proximo",
        "servicio_sin_rendicion",
        "servicio_sin_informe",
        "rendicion_aprobada",
        "rendicion_rechazada",
        "rendicion_pendiente_revision",
        "mencion_comentario",
        "sistema",
        "factura_solicitada",
        "factura_tecnico_subida",
        "evento_sin_asistencia",
        "gasto_pendiente_aprobacion",
        "gasto_resuelto",
      ],
      tipodecontrato: ["Fijo", "Independiente"],
      "Unidades de Facturacion": ["Litros", "Kgs", "USD"],
    },
  },
} as const
