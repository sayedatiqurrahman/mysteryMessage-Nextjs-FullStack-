export const MethodCheck = (
  req: any,
  method: string
): { req: any; method: string } => {
  if (req.method !== method) {
    throw Response.json(
      {
        success: false,
        message: "method not allowed",
      },
      { status: 405 }
    );
  }

  // Return the expected object if the method matches
  return { req, method };
};
