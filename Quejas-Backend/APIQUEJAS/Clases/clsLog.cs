using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsLog
    {
        public void guardarBitacora(string titulo)
        {            

            string nombreLog = DateTime.Today.Day.ToString() + "-" + DateTime.Today.Month.ToString() + "-" + DateTime.Today.Year.ToString() + ".txt";

            string carpeta = HttpContext.Current.Request.MapPath("~/log/");

            string path = HttpContext.Current.Request.MapPath("~/log/" + nombreLog);

            if (!System.IO.Directory.Exists(carpeta))
            {
                System.IO.Directory.CreateDirectory(carpeta);
            }

            StreamWriter sw = new StreamWriter(path, true);

            StackTrace stacktrace = new StackTrace();
            sw.WriteLine("=============================================================================");
            sw.WriteLine(titulo + " --> " + "Hora: " + DateTime.Now.ToLongTimeString() + " --> Fecha: " + DateTime.Now.ToLongDateString());
            sw.WriteLine("=============================================================================");
            //sw.WriteLine("Método: " + metodo);
            //sw.WriteLine(mensaje);
            //sw.WriteLine(stacktrace.GetFrame(1).GetMethod().Name + " - " + ex.ToString() + "\n\n\n -" + ex.Message + "\n\n\n -" + ex.StackTrace);
            sw.WriteLine("");

            sw.Flush();
            sw.Close();

        }

        public void guardarBitacoraCuerpo(string titulo, string mensaje, string metodo)
        {            

            string nombreLog = DateTime.Today.Day.ToString() + "-" + DateTime.Today.Month.ToString() + "-" + DateTime.Today.Year.ToString() + ".txt";

            string carpeta = HttpContext.Current.Request.MapPath("~/log/");

            string path = HttpContext.Current.Request.MapPath("~/log/" + nombreLog);

            if (!System.IO.Directory.Exists(carpeta))
            {
                System.IO.Directory.CreateDirectory(carpeta);
            }

            StreamWriter sw = new StreamWriter(path, true);

            StackTrace stacktrace = new StackTrace();
            sw.WriteLine(titulo + " --> " + "Hora: " + DateTime.Now.ToLongTimeString() + " --> Fecha: " + DateTime.Now.ToLongDateString());
            sw.WriteLine("Método: " + metodo +" ");
            sw.WriteLine(mensaje);
            //sw.WriteLine(stacktrace.GetFrame(1).GetMethod().Name + " - " + ex.ToString() + "\n\n\n -" + ex.Message + "\n\n\n -" + ex.StackTrace);
            sw.WriteLine("");

            sw.Flush();
            sw.Close();

        }
    }
}
